const mongoose = require("mongoose");
const { Schema } = mongoose;

const User = new Schema({
    short_id: String,
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    friends: [],
    avatar: {
        type: String,
        default: "default-avatar.png"
    },
    banner: {
        type: String,
        default: "default-banner.png"
    }
})

module.exports = mongoose.model("User", User);