const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const passport = require("./passport/index");
const config = require("./config/keys");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

/* Web sockets */
const { wss } = require("./config/ws");

app.use('/api/uploads', express.static(path.join(__dirname + "/api/uploads")));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// app.use(morgan('tiny'));
app.use(cors({
    origin: [
        'http://localhost:8080',
        'http://192.168.43.5:8080'
    ],
}));
app.use(passport.initialize());

// db
mongoose.connect(config.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.once("open", () => {
    console.log("[DATABASE] database is running");
})
mongoose.connection.on("error", () => {
    console.log("[DATABASE] [ERR] database is not connected!");
})

// api
const api = require("./api/routes/index");
app.use("/api", api);

const server = app.listen(PORT, () => {
    console.log("Server is running!");
})

server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (socket) => {
        wss.emit('connection', socket, request);
        console.log("UPGRADE!");
    })
})