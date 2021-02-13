const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const passport = require("../passport/index");

router.get("/me", passport.authenticate("jwt", {session: false}), (req, res) => {
    res.status(200).send(req.user);
})

module.exports = router;