const mongoose = require("mongoose");
const { Schema } = mongoose;

const Event = new Schema({
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    title: String,
    description: String,
    date: {
        type: Date,
        default: Date.now
    },
    image: String,
    invited: [{
        inviting: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
        invited: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        }
    }],
    interested: [{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }],
    participants: [{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }]
}, {timestamps: true})

module.exports = mongoose.model("Event", Event);