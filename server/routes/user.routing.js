const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const passport = require("../passport/index");

router.get("/me", passport.authenticate("jwt", {session: false}), (req, res) => {
    let {password, _id, __v, email, ...result} = req.user._doc;
    res.status(200).send(result);
})

router.get("/basic-data/:id", passport.authenticate("jwt", {session: false}), (req, res) => {
    User.findOne({short_id: req.params.id}, (err, user) => {
        if(err)
            return res.status(500).send("Błąd serwera");
        
        if(user) {
            let {_id, email, password, __v, ...result} = user._doc;
            return res.status(200).send(result);
        } else {
            return res.status(404).send("Użytkownik nie istnieje!");
        }
    })
})

module.exports = router;