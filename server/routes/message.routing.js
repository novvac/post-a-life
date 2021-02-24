const express = require("express");
const router = express.Router();
const passport = require("../passport/index");
const Message = require("../models/Message.model");
const User = require("../models/User.model");

router.get("/user/:id/messages/", passport.authenticate("jwt", { session: false }), async (req, res) => {
    let user = null;

    if (req.params.id !== req.user.short_id)
        user = await User.findOne({short_id: req.params.id});

    if(user) {
        return res.status(200).json(req.params.id);
    } else {
        return res.status(404).json("error");
    }   
})

module.exports = router;