const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const passport = require("../passport/index");
const multer = require('multer');
const storage = require('../config/multer');

const upload = multer({storage: storage});

// GET CURRENT LOGGED USER
router.get("/", passport.authenticate("jwt", {session: false}), (req, res) => {
    let {password, _id, __v, email, friends, ...result} = req.user._doc;
    res.status(200).json({user: result});
})

// GET USER WITH :id (SHORT_ID)
router.get('/:id', passport.authenticate("jwt", {session: false}), (req, res) => {
    User.findOne({short_id: req.params.id}, (err, doc) => {
        if(err)
            return res.status(500).json({
                error: {
                    code: "SERV_f82s",
                    msg: "Server error",
                    details: "Wystąpił nieoczekiwany błąd! Prosimy o kontakt!"
                }
            });
        
        if(doc) {
            let {_id, email, password, __v, friends, ...result} = doc._doc;
            return res.status(200).send(result);
        } else {
            return res.status(404).json({
                error: {
                    code: "UDE_5f82",
                    msg: "User does not exist",
                    details: "Użytkownik o podanym ID nie istnieje!"
                }
            });
        }
    })
})

// UPLOAD NEW BANNER AND SET THEM FOR LOGGED USER
router.post("/banner/", passport.authenticate("jwt", {session: false}), upload.single('banner'), (req,res) => {
    User.findOne({_id: req.user.id}, (err, user) => {
        if(err)
            return res.status(500).json({
                error: {
                    code: "SERV_ba02",
                    msg: "Server error",
                    details: "Wystąpił nieoczekiwany błąd! Prosimy o kontakt!"
                }
            });
        
        if(user) {
            user.banner = req.file.filename;
            user.save();

            res.status(200).json('success');
        }
    })
})

// UPLOAD NEW AVATAR AND SET THEM FOR LOGGED USER
router.post("/avatar/", passport.authenticate("jwt", {session: false}), upload.single('avatar'), (req, res) => {
    User.findOne({_id: req.user.id}, (err, user) => {
        if(err)
        return res.status(500).json({
            error: {
                code: "SERV_bap4",
                msg: "Server error",
                details: "Wystąpił nieoczekiwany błąd! Prosimy o kontakt!"
            }
        });
        
        if(user) {
            user.avatar = req.file.filename;
            user.save();

            res.status(200).json('success');
        }
    })
})

module.exports = router;