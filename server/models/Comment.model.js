const mongoose = require("mongoose");
const { Schema } = mongoose;

let Comment = new Schema({
    text: {
        type: String,
        required: true,
    },
    post: {
        type: mongoose.Types.ObjectId,
        ref: "Post",
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    likes: [{
        type: mongoose.Types.ObjectId,
        ref: "User",
    }],
    dislikes: [{
        type: mongoose.Types.ObjectId,
        ref: "User",
    }],
    subComments: [{
        type: mongoose.Types.ObjectId,
        ref: "Comment",
    }]
}, {timestamps: true});

module.exports = mongoose.model("Comment", Comment);