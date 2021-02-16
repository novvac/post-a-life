const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const passport = require("../passport/index");
const multer = require('multer');
const storage = require('../config/multer');

const upload = multer({storage: storage});

// GET CURRENT LOGGED USER
router.get("/", passport.authenticate("jwt", {session: false}), (req, res) => {
    let {password, _id, __v, email, ...result} = req.user._doc;
    res.status(200).json({user: result});
})

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
            let {_id, email, password, __v, ...result} = doc._doc;
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

router.get("/relation/:id", passport.authenticate("jwt", {session: false}), (req, res) => {
    User.findOne({short_id: req.params.id}, (err, doc) => {
        if(err)
            return res.status(500).json({
                error: {
                    code: "SERV_f8F1",
                    msg: "Server error",
                    details: "Wystąpił nieoczekiwany błąd! Prosimy o kontakt!"
                }
            });
        
        if(doc) {
            let loggedUser = req.user.friends.includes(doc._id);
            let foundUser = doc.friends.includes(req.user._id);

            res.status(200);

            if(!loggedUser && !foundUser)
                return res.json({status: "N"}); // not friends
            else if(loggedUser && foundUser)
                return res.json({status: "F"}); // friends
            else if(loggedUser && !foundUser)
                return res.json({status: "P"}); // pending
            else if(!loggedUser && foundUser)
                return res.json({status: "R"}); // received
        } else {
            return res.status(404).json({
                error: {
                    code: "UDE_5f92",
                    msg: "User does not exist",
                    details: "Użytkownik o podanym ID nie istnieje!"
                }
            });
        }
    })
})

router.put("/relation/", passport.authenticate("jwt", {session: false}), (req, res) => {
    function deleteIdFromArray(arr, id) {
        return arr.filter((val, index, arr) => {
            return val != id;
        })
    }
    
    User.findOne({_id: req.user.id}, (err, loggedUser) => {
        if(err)
            return res.status(500).json({
                error: {
                    code: "SERV_bxci",
                    msg: "Server error",
                    details: "Wystąpił nieoczekiwany błąd! Prosimy o kontakt!"
                }
            });
        
        if(loggedUser) {
            User.findOne({short_id: req.body.id}, (err, foundUser) => {
                if(foundUser) {
                    const mutation = req.body.mutation;
                    const lUserHas = loggedUser.friends.includes(foundUser.id);     // ? logged user has found user in friends?
                    const fUserHas = foundUser.friends.includes(loggedUser.id);     // ? found user has logged user in friends?
                    
                    if(mutation == "ADD") {     // ? add found user to logged user friends
                        if(!lUserHas)
                            loggedUser.friends.push(foundUser.id);
                    }
                    else if(mutation == "SET") {    // ? make logged and found user as friends
                        if(!lUserHas)
                            loggedUser.friends.push(foundUser.id);
                        if(!fUserHas)
                            foundUser.friends.push(loggedUser.id)
                    }
                    else if(mutation == "DESTROY") {    // ? unmake logged and found user as friends
                        loggedUser.friends = deleteIdFromArray(loggedUser.friends, foundUser.id);
                        foundUser.friends = deleteIdFromArray(foundUser.friends, loggedUser.id);
                    }
                    
                    loggedUser.save();
                    foundUser.save();

                    return res.status(200).send("success");
                } else {
                    return res.status(404).json({
                        error: {
                            code: "UDE_7l0s",
                            msg: "User does not exist",
                            details: "Użytkownik o podanym ID nie istnieje!"
                        }
                    });
                }
            })
        } else {
            return res.status(404).json({
                error: {
                    code: "UDE_732s",
                    msg: "User does not exist",
                    details: "Użytkownik o podanym ID nie istnieje!"
                }
            });
        }
    })
})

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

// ! deprecated (this will be used with wss)
// router.get("/friends/", passport.authenticate("jwt", {session: false}), (req, res) => {
//     const friends = req.user.friends;
    
//     User.find({_id: friends}, (err, docs) => {
//         if(err)
//             return res.status(500).send("Błąd serwera!");

//         current = 1;
//         for(doc of docs) {
//             let isFriend = null;
//             if(doc.friends.includes(req.user.id))
//                 isFriend = true;
//             else
//                 isFriend = false;

//             let {friends, _id, email, password, __v, ...result} = doc._doc;
//             addData(result, isFriend, current, docs.length);
            
//             current++;
//         }
//     })

//     let dataToSend = [];
//     function addData(data, isFriend, current, max) {
//         if(isFriend)
//             dataToSend.push(data);
        
//         if(current === max)
//             sendData();
//     }

//     function sendData() {
//         res.status(200).json({data: dataToSend});
//     }
// })

module.exports = router;