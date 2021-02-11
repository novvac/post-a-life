const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User.model");

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

            bcrypt.genSalt(10, (err, salt) => {
                if(err)
                    return res.status(500).send("Server error 2");
                
                bcrypt.hash(req.body.password, salt, (err, encrypted) => {
                    if(err)
                        return res.status(500).send("Server error 3");

                    newUser.password = encrypted;
                    newUser.save();

                    return res.status(200).json({msg: "Konto utworzone, możesz się teraz zalogować!"});
                })
            })
        }
    })
})

// DEBUG - users list
router.get("/users", (req, res) => {
    User.find((err, users) => {
        if(err)
            return res.status(500).send("Server error!");

        res.json({users});
    })
})

const validateSignInData = require("../validators/signInValidator");
router.post('/sign-in', (req, res) => {
    const { errors, isCorrect } = validateSignInData(req.body);

    if(!isCorrect) {
        return res.status(500).json({errors});
    }

    User.findOne({email: req.body.email}, (err, user) => {
        if(err)
            return res.status(500).send("Server error 1");
        
        if(!user) {
            return res.status(404).json({errors: {email: "Niepoprawny email!"}});
        }

        bcrypt.compare(req.body.password, user.password, (err, isSame) => {
            if(err)
                return res.status(500).send("Server error 2");
            
            if(isSame) {
                // user is log in

                return res.status(200).json({msg: "Zalogowano! Za chwilę nastąpi przekierowanie!"});
            } else {
                return res.status(500).json({errors: {password: "Hasło niepoprawne!"}});
            }
        })
    })
})

module.exports = router;