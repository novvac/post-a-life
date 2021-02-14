const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const passport = require("../passport/index");

router.get("/me", passport.authenticate("jwt", {session: false}), (req, res) => {
    let {password, _id, __v, email, ...result} = req.user._doc;
    res.status(200).send(result);
})

module.exports = router;