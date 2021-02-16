const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const passport = require("../passport/index");
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "-" + req.user.short_id + '-' + Date.now() + "." + file.mimetype.replace("image/", ''));
    }
})

const upload = multer({storage: storage});

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

function deleteIdFromArray(arr, id) {
    return arr.filter((val, index, arr) => {
        return val != id;
    })
}

router.post("/set-relation/", passport.authenticate("jwt", {session: false}), (req, res) => {
    User.findOne({_id: req.user.id}, (err, sender) => {
        if(err)
            return res.status(500).send("Błąd serwera!");

        if(sender) {
            User.findOne({short_id: req.body.id}, (err, recipient) => {
                if(recipient) {
                    const mutation = req.body.mutation
                    if(mutation == "ADD") {
                        if(!sender.friends.includes(recipient.id))
                            sender.friends.push(recipient.id);
                    } else if(mutation == "SET") {
                        if(!sender.friends.includes(recipient.id))
                            sender.friends.push(recipient.id);
                        if(!recipient.friends.includes(sender.id))
                            recipient.friends.push(sender.id)
                    } else if(mutation == "DESTROY") {
                        sender.friends = deleteIdFromArray(sender.friends, recipient.id);
                        recipient.friends = deleteIdFromArray(recipient.friends, sender.id);
                    }
                    
                    sender.save();
                    recipient.save();

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

router.get("/friends/", passport.authenticate("jwt", {session: false}), (req, res) => {
    const friends = req.user.friends;
    
    User.find({_id: friends}, (err, docs) => {
        if(err)
            return res.status(500).send("Błąd serwera!");

        current = 1;
        for(doc of docs) {
            let isFriend = null;
            if(doc.friends.includes(req.user.id))
                isFriend = true;
            else
                isFriend = false;

            let {friends, _id, email, password, __v, ...result} = doc._doc;
            addData(result, isFriend, current, docs.length);
            
            current++;
        }
    })

    let dataToSend = [];
    function addData(data, isFriend, current, max) {
        if(isFriend)
            dataToSend.push(data);
        
        if(current === max)
            sendData();
    }

    function sendData() {
        res.status(200).json({data: dataToSend});
    }
})

router.post("/banner/upload/", passport.authenticate("jwt", {session: false}), upload.single('banner'), (req,res) => {
    User.findOne({_id: req.user.id}, (err, user) => {
        if(err)
            return res.status(500).send("Błąd serwera!");
        
        if(user) {
            user.banner = req.file.filename;
            user.save();

            res.status(200).json({file: "ok"});
        } else {
            if(err)
            return res.status(404).send("Użytkownik nie istnieje!");
        }
    })
})

router.post("/avatar/upload/", passport.authenticate("jwt", {session: false}), upload.single('avatar'), (req, res) => {
    User.findOne({_id: req.user.id}, (err, user) => {
        if(err)
            return res.status(500).send("Błąd serwera!");
        
        if(user) {
            user.avatar = req.file.filename;
            user.save();

            res.status(200).json({file: "ok"});
        } else {
            if(err)
            return res.status(404).send("Użytkownik nie istnieje!");
        }
    })
})

module.exports = router;