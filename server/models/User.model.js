const mongoose = require("mongoose");
const { Schema } = mongoose;

const User = new Schema({
    short_id: String,
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    friends: Array
})

module.exports = mongoose.model("User", User);