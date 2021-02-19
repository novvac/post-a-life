const mongoose = require("mongoose");
const { Schema } = mongoose;

let Comment = new Schema({
    text: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    }
}, {timestamps: true});

module.exports = mongoose.model("Comment", Comment);