const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const config = require("../config/keys");

function encodeShortID(num) {
    let encoded =  num.toString(36);
    while(encoded.length < 4) {
        encoded = '0' + encoded;
    }
    return encoded;
}

function decodeShortID(encoded) {
    return parseInt(encoded, 36);
}

const validateSignUpData = require("../validators/signUpValidator");
router.post('/sign-up', (req, res) => {
    const { errors, isCorrect } = validateSignUpData(req.body);

    if(!isCorrect) {
        return res.status(500).json({errors});
    }

    User.findOne({email: req.body.email}, (err, user) => {
        if(err) {
            return res.status(500).send("Server error 1");
        }

        if(user) {
            return res.status(500).json({errors: {email: "Konto zostało już utworzone z podanych adresem email!"}})
        } else {
            let newUser = new User(req.body);

            // set short id
            User.countDocuments((err, count) => {
                if(count > 0) {
                    User.findOne({}, {}, {skip: count-1}, (err, lastUser) => {
                        const short_id = decodeShortID(lastUser.short_id);
                        newUser.short_id = encodeShortID(short_id+1);
                    })
                } else {
                    newUser.short_id = encodeShortID(1);
                }
            })

            bcrypt.genSalt(10, (err, salt) => {
                if(err)
                    return res.status(500).send("Server error 2");
                
                bcrypt.hash(req.body.password, salt, (err, encrypted) => {
                    if(err)
                        return res.status(500).send("Server error 3");

                    newUser.password = encrypted;

                    const DEFAULT_BANNER = "default-banner.png";
                    const DEFAULT_AVATAR = "default-avatar.png";
                    newUser.avatar = DEFAULT_AVATAR;
                    newUser.banner = DEFAULT_BANNER;

                    newUser.save();

                    return res.status(200).json({msg: "Konto utworzone, możesz się teraz zalogować!"});
                })
            })
        }
    })
})

const validateSignInData = require("../validators/signInValidator");
router.post('/sign-in', (req, res, next) => {
    const { errors, isCorrect } = validateSignInData(req.body);

    if(!isCorrect) {
        return res.status(500).json({errors});
    }

    User.findOne({email: req.body.email}, (err, user) => {
        if(user) {
            bcrypt.compare(req.body.password, user.password, (err, isCorrect) => {
                if(isCorrect) {
                    const payload = {
                        id: user.id,
                    }

                    const token = jwt.sign(payload, config.secretOrKey);

                    return res.status(200).json({token, msg: "Zalogowano!"});
                } else {
                    return res.status(404).json({errors: {password: "Nieprawidłowe dane logowania!"}});
                }
            })
        } else {
            return res.status(404).json({errors: {password: "Nieprawidłowe dane logowania!"}});
        }
    })
})

module.exports = router;