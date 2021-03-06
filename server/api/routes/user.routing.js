const express = require("express");
const router = express.Router();
const User = require("../../models/User.model");
const Friend = require("../../models/Friend.model");
const Message = require("../../models/Message.model");
const passport = require("../../passport/index");
const multer = require('multer');
const mongoose = require("mongoose");
const storage = require('../../config/multer');
const { clients, socketExec } = require("../../config/ws");
const { Router } = require("express");

const upload = multer({storage: storage});

// ! ############################
// ! GET CURRENT LOGGED USER
// ! ############################
router.get("/id/", passport.authenticate("jwt", {session: false}), (req, res) => {
    let {password, __v, email, friends, ...result} = req.user._doc;
    res.status(200).json({user: result});
})

// ! ##############################################
// ! GET USER WITH :id (short_id or ObjectID)
// ! ##############################################
router.get('/id/:id', passport.authenticate("jwt", {session: false}), async (req, res) => {
    let user = null;

    // check if request param (id) is short_id or ObjectID
    var regex = new RegExp("^[0-9a-fA-F]{24}$")
    if(regex.test(req.params.id)) {
        user = await User.findOne({
            _id: mongoose.Types.ObjectId(req.params.id),
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

// ! ####################################################
// ! UPLOAD NEW BANNER AND SET THEM FOR LOGGED USER
// ! ####################################################
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

// ! ##########################
// ! GET LOGGED USER BANNER
// ! ##########################
router.get("/banner/", passport.authenticate("jwt", {session: false}), async (req, res) => {
    return res.status(200).json(req.user.banner);
})

// ! ####################################################
// ! UPLOAD NEW AVATAR AND SET THEM FOR LOGGED USER
// ! ####################################################
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

// ! ##########################
// ! GET LOGGED USER AVATAR
// ! ##########################
router.get("/avatar/", passport.authenticate("jwt", {session: false}), async (req, res) => {
    return res.status(200).json(req.user.avatar);
})

// ! type:
// ?    1   - friends
// ?    2   - pending
// ?    3   - received
// ! ####################################################
// ! GET FRIENDS
// ! ####################################################
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

    if(req.params.type == 1) {
        req.user.friends = friendsList;
    }
    
    res.status(200).json({list: friendsList});
})

// ! ####################################################
// ! GET FRIEND STATUS FOR USER (ID IN BODY)
// ! ####################################################
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

// ! ####################################################
// ! CREATE NEW RELATION BETWEEN USERS (SEND INVITE)
// ! ####################################################
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
// ! ####################################################
// ! CHANGE RELATION BETWEEN USERS TO 'FRIENDS'
// ! ####################################################
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
        socketExec([recipient.id, req.user.id], "LOAD_FRIENDS");

        res.status(200).json({status: 1});
    }
})
// ! ####################################################
// ! DELETE RELATION BETWEEN USERS
// ! ####################################################
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
        socketExec([recipient.id, req.user.id], "LOAD_FRIENDS");

        res.status(200).json({status: 0});
    }
});

// ! ############################
// ! GET ONLINE FRIENDS
// ! ############################
router.post("/active-friends/", passport.authenticate("jwt", {session: false}), (req, res) => {
    let mapClients = clients.map((item) => item.id);

    let dataToSend = [];
    for(var i=0; i<req.body.ids.length; i++) {
        let index = mapClients.indexOf(req.body.ids[i]);

        let obj = {
            id: req.body.ids[i],
            isActive: index > -1 ? true : false
        }
        dataToSend.push(obj);
    }
    res.status(200).json(dataToSend);
})

// ! ############################
// ! GET LASTEST MESSAGES
// ! ############################
router.get("/:id/messages/:skip-:limit", passport.authenticate("jwt", {session: false}), async (req, res) => {
    let recipient = null;

    if(req.params.id !== req.user.short_id) {
        recipient = await User.findOne({
            short_id: req.params.id,
        }, {
            avatar: 1,
            firstName: 1,
            lastName: 1,
            short_id: 1,
        })
    }

    if(recipient) {
        let messages = await Message.find({
            $or: [
                {sender: req.user.id, recipient: recipient._id},
                {sender: recipient._id, recipient: req.user.id}
            ]
        }, {}, {
            sort: {createdAt: -1}
        }).skip(parseInt(req.params.skip)).limit(parseInt(req.params.limit)).populate({
            path: "sender",
            select: {
                avatar: 1,
            }
        });

        await Message.updateMany({
            $or: [
                {sender: recipient._id, recipient: req.user.id}
            ]
        }, {}, {
            sort: {createdAt: -1}
        }).limit(12).set({readed: true});

        res.status(200).json({user: recipient, messages});
    } else {
        res.status(404).json('error');
    }
})

// ! #######################
// ! ADD NEW MESSAGE
// ! #######################
router.post("/:id/message/", passport.authenticate("jwt", {session: false}), async (req, res) => {
    let recipient = await User.findOne({
        short_id: req.params.id
    }, {
        _id: 1,
    })
    
    let message = await new Message({
        sender: req.user.id,
        recipient: recipient._id,
        text: req.body.message,
    })

    message.save();

    // sockets
    socketExec([recipient._id], "NEW_MESSAGE");
    
    res.status(200).json('sucess');
})

// ! ############################
// ! LOAD UNREAD MESSAGES
// ! ############################
router.get("/unread-messages/", passport.authenticate("jwt", {session: false}), async (req, res) => {
    let result = await Message.aggregate([
        {$project: {
            sender: 1,
            recipient: 1,
            readed: 1,
            _id: 0,
        }},
        {$match: {
            recipient: mongoose.Types.ObjectId(req.user.id),
            readed: false
        }},
    ])
    
    res.status(200).json(result);
})

module.exports = router;