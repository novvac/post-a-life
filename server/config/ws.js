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
                let id = decoded.id;

                let index = clients.map((item) => item.id).indexOf(id);
                if(index === -1) {
                    clients.push({id, ws});
                } else {
                    clients[index].ws = ws;
                }
            }
        })
    })

    ws.on("close", function() {
        let index = clients.map((item) => item.ws).indexOf(ws);
        
        clients.splice(index, 1);
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