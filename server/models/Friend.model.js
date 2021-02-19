const mongoose = require("mongoose");
const { Schema } = mongoose;

const Friend = new Schema({
    requester: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    recipient: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    friendStatus: {
        type: Number,
        enum: [
            1,      // ? friends
            2,      // ? pending
            3       // ? received
        ]
    }
}, {timestamps: true});

module.exports = mongoose.model("Friend", Friend);