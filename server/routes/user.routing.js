const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Friend = require("../models/Friend.model");
const passport = require("../passport/index");
const multer = require('multer');
const mongoose = require("mongoose");
const storage = require('../config/multer');
const { clients, socketExec } = require("../config/ws");

const upload = multer({storage: storage});

// GET CURRENT LOGGED USER
router.get("/id/", passport.authenticate("jwt", {session: false}), (req, res) => {
    let {password, __v, email, friends, ...result} = req.user._doc;
    res.status(200).json({user: result});
})

// GET USER WITH :id (short_id or ObjectID)
router.get('/id/:id', passport.authenticate("jwt", {session: false}), async (req, res) => {
    let user = null;

    // check if request param (id) is short_id or ObjectID
    var regex = new RegExp("^[0-9a-fA-F]{24}$")
    if(regex.test(req.params.id)) {
        user = await User.findOne({
            _id: mongoose.Types.ObjectId(req.params.id)
        })
    } else {
        user = await User.findOne({
            short_id: req.params.id
        })
    }

    // if user was found - send his data to client. Otherwise send 404 error
    if(user) {
        let {email, password, __v, friends, ...result} = user._doc;
        return res.status(200).send(result);
    } else {
        return res.status(404).json('error');
    }
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

// ! type:
// ?    1   - friends
// ?    2   - pending
// ?    3   - received
router.get("/friends/type/:type", passport.authenticate("jwt", {session: false}), async(req, res) => {
    let user = await User.findOne(
        {_id: req.user.id},
        {friends: 1},
    ).populate({
        path: "friends",
        match: {friendStatus: req.params.type},
        select: {'recipient': 1, '_id': 0}
    });

    // ? get only users id
    let friendsListMap = user.friends.map(({recipient}) => [recipient]);
    let friendsList = [];

    for(f of friendsListMap) {
        await friendsList.push(f[0]);
    }
    
    res.status(200).json({list: friendsList});
})

router.get("/friend/:id", passport.authenticate("jwt", {session: false}), async (req, res) => {
    const recipient = await User.findOne({short_id: req.params.id});

    if(!recipient)
        return res.status(404).json({status: -1});

    let friend = await User.find(
            {_id: req.user.id},
            {friends: 1},
        ).populate({    
            path: "friends",
            match: {recipient: {$eq: recipient.id}}
        });

    if(friend[0].friends.length > 0) {
        return res.status(200).json({status: friend[0].friends[0].friendStatus})
    } else
        return res.status(200).json({status: 0})
})

router.post("/friend/", passport.authenticate("jwt", {session: false}), async (req, res) => {
    const recipient = await User.findOne({short_id: req.body.id});

    if(recipient) {
        const req_doc = await Friend.findOneAndUpdate(
            {requester: req.user.id, recipient: recipient.id},
            {$set: { friendStatus: 2 }},
            {upsert: true, new: true, useFindAndModify: false}
        )

        const rec_doc = await Friend.findOneAndUpdate(
            {requester: recipient.id, recipient: req.user.id},
            {$set: { friendStatus: 3 }},
            {upsert: true, new: true, useFindAndModify: false}
        )

        if(!req.user.friends.includes(req_doc.id)) {
            req.user.friends.push(req_doc.id);
            await req.user.save();
        }

        if(!recipient.friends.includes(rec_doc.id)) {
            recipient.friends.push(rec_doc.id);
            await recipient.save();
        }

        // sockets
        socketExec([recipient.id, req.user.id], "LOAD_INVITATIONS");

        res.status(200).json({status: req_doc.friendStatus});
    }
})
router.put("/friend/:id", passport.authenticate("jwt", {session: false}), async (req, res) => {
    const recipient = await User.findOne({short_id: req.params.id});

    if(recipient) {
        await Friend.findOneAndUpdate(
            {requester: req.user.id, recipient: recipient.id},
            {$set: { friendStatus: 1 }},
            {useFindAndModify: false}
        )

        await Friend.findOneAndUpdate(
            {requester: recipient.id, recipient: req.user.id},
            {$set: { friendStatus: 1 }},
            {useFindAndModify: false}
        )

        // sockets
        socketExec([recipient.id, req.user.id], "LOAD_INVITATIONS");

        res.status(200).json({status: 1});
    }
})
router.delete("/friend/:id", passport.authenticate("jwt", {session: false}), async(req, res) => {
    let recipient = await User.findOne({short_id: req.params.id});

    if(recipient) {
        let req_doc = await Friend.findOneAndRemove(
            {requester: req.user.id, recipient: recipient.id},
            {useFindAndModify: false}
        )
        let rec_doc = await Friend.findOneAndRemove(
            {requester: recipient.id, recipient: req.user.id},
            {useFindAndModify: false}
        )

        if(req_doc) {
            if(req.user.friends.includes(req_doc._id)) {
                req.user.friends.splice(req.user.friends.indexOf(req_doc.id), 1);
                await req.user.save();
            }
        }

        if(rec_doc) {
            if(recipient.friends.includes(rec_doc._id)) {
                recipient.friends.splice(recipient.friends.indexOf(rec_doc.id, 1));
                await recipient.save();
            }
        }
        
        // sockets
        socketExec([recipient.id, req.user.id], "LOAD_INVITATIONS");

        res.status(200).json({status: 0});
    }
})

module.exports = router;