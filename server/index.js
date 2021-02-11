const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors());

// db
mongoose.connect("mognodb://localhost:27017/post-a-life", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.once("open", () => {
    console.log("[DATABASE] database is running");
})
mongoose.connection.on("error", () => {
    console.log("[DATABASE] [ERR] database is not connected!");
})

app.listen(PORT, () => {
    console.log("Server is running!");
})