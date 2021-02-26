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

app.use('/uploads', express.static(path.join(__dirname + "/uploads")));
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

// routing
const auth = require("./routes/auth.routing");
const user = require("./routes/user.routing");
const main = require("./routes/main.routing");
const post = require("./routes/post.routing");
const comment = require("./routes/comment.routing");
const message = require("./routes/message.routing");
app.use("/api/auth/", auth);
app.use("/api/user/", user);
app.use("/api/main/", main);
app.use("/api/post/", post);
app.use("/api/comment/", comment);
app.use("/api/message/", message);

const server = app.listen(PORT, () => {
    console.log("Server is running!");
})

server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (socket) => {
        wss.emit('connection', socket, request);
        console.log("UPGRADE!");
    })
})