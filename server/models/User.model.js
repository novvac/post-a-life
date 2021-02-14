const mongoose = require("mongoose");
const { Schema } = mongoose;

const User = new Schema({
    short_id: String,
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    // here will be something (idk what yet)
})

module.exports = mongoose.model("User", User);