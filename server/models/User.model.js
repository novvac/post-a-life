const mongoose = require("mongoose");
const { Schema } = mongoose;

const User = new Schema({
    short_id: String,
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    friends: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        status: {
            type: Number,
            enum: [
                0,  // not friends
                1,  // friends
                2,  // pending
                3   // received
            ]
        }
    }],
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