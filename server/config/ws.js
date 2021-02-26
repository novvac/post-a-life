const WebSocket = require("ws");
const wss = new WebSocket.Server({noServer: true});
const jwt = require("jsonwebtoken");
const config = require('./keys');

let clients = [];

wss.on("connection", function connection(ws, request, client) {
    ws.once("message", function message(msg) {
        const data = JSON.parse(msg);

        jwt.verify(data.token, config.secretOrKey, function(err, decoded) {
            if(err) {
                console.log("Invalid token!");
            } else {
                const id = decoded.id;

                let index = clients.findIndex(el => el.id === id);
                if(index !== -1) {
                    clients[index].ws = ws;
                    // console.log("Socket updated!");
                } else {
                    const obj = {
                        id,
                        ws
                    }
                    clients.push(obj);
                    // console.log("Socket successfully added!");
                }
            }
        })
    })

    ws.on("close", function() {
        let index = clients.findIndex(el => el.ws == ws);
        clients = clients.splice(index, 1);
    })
})

function findSocket(id) {
    return clients.findIndex(el => el.id === id);
}

module.exports = {
    wss,
    clients,
    findSocket
}