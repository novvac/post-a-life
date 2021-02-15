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

router.get("/friend-status/:id", passport.authenticate("jwt", {session: false}), (req, res) => {
    User.findOne({short_id: req.params.id}, (err, user) => {
        if(err)
            return res.status(500).send("Błąd serwera!");

        if(user) {
            //sprawdź czy user nie sprawdza znajomości ze samym sobą

            let userA = req.user.friends.includes(user._id);
            let userB = user.friends.includes(req.user._id);

            res.status(200);

            if(!userA && !userB)
                return res.json({icon: "account-plus", text: "Dodaj do znajomych", status: "N"});
            else if(userA && userB)
                return res.json({icon: "account-multiple", text: "Jesteście znajomymi", status: "F"});
            else if(userA && !userB)
                return res.json({icon: "check", text: "Wysłano zaproszenie", status: "P"});
            else if(!userA && userB)
                return res.json({icon: "account-alert", text: "Otrzymano zaproszenie", status: "R"});
        } else {
            return res.status(404).send("Użytkownik nie istnieje!");
        }
    })
})

router.post("/add-friend/", passport.authenticate("jwt", {session: false}), (req, res) => {
    User.findOne({_id: req.user.id}, (err, sender) => {
        if(err)
            return res.status(500).send("Błąd serwera!");

        if(sender) {
            User.findOne({short_id: req.body.id}, (err, recipient) => {
                if(recipient) {
                    if(!sender.friends.includes(recipient.id))
                        sender.friends.push(recipient.id);
                    
                    sender.save();

                    return res.status(200).send("ok");
                } else {
                    return res.status(404).send("Użytkownik nie istnieje!");
                }
            })
        } else {
            return res.status(404).send("Użytkownik nie istnieje!");
        }
    })
})

router.post("/harden-relation/", passport.authenticate("jwt", {session: false}), (req, res) => {
    console.log(req.body);
})

router.post("/destroy-relation/", passport.authenticate("jwt", {session: false}), (req, res) => {
    console.log(req.body);
})

module.exports = router;