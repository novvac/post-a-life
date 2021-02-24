const mongoose = require("mongoose");
const { Schema } = mongoose;

const Message = new Schema({
    sender: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    recipient: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    text: String,
    readed: {
        type: Boolean,
        default: false,
    }
}, {timestamps: true})

module.exports = mongoose.model("Message", Message);