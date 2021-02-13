const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const passport = require("./passport/index");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors({
    origin: [
        'http://localhost:8080',
        'http://192.168.43.5:8080'
    ],
}));
app.use(passport.initialize());

// db
mongoose.connect("mongodb://localhost:27017/post-a-life", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.once("open", () => {
    console.log("[DATABASE] database is running");
})
mongoose.connection.on("error", () => {
    console.log("[DATABASE] [ERR] database is not connected!");
})

// routing
const auth = require("./routes/auth.routing");
const user = require("./routes/user.routing");
app.use("/api/auth/", auth);
app.use("/api/user/", user);

app.listen(PORT, () => {
    console.log("Server is running!");
})