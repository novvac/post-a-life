const mongoose = require("mongoose");
const { Schema } = mongoose;

let Post = new Schema({
    mind: {
        type: String,
        required: true,
    },
    images: [],
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
    }]
}, {timestamps: true});

module.exports = mongoose.model("Post", Post);