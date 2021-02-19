const mongoose = require("mongoose");
const { Schema } = mongoose;

let Post = new Schema({
    text: {
        type: String,
        required: true,
    },
    images: [],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    likes: [{
        type: mongoose.Types.ObjectId,
        ref: "User",
    }],
    comments: [{
        type: mongoose.Types.ObjectId,
        ref: "Comment",
    }]
}, {timestamps: true});

module.exports = mongoose.model("Post", Post);