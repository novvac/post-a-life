const mongoose = require("mongoose");
const { Schema } = mongoose;

let Post = new Schema({
    mind: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    likes: [{
        type: mongoose.Types.ObjectId,
        ref: "User",
    }],
    comments: [{
        type: mongoose.Types.ObjectId,
        ref: "Comment",
    }],
    visibility: {
        type: String,
        default: "friends",
    }
}, {timestamps: true});

module.exports = mongoose.model("Post", Post);