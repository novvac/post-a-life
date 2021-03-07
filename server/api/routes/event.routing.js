const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const passport = require("../../passport/index");
const Event = require("../../models/Event.model");
const Friend = require('../../models/Friend.model');
const User = require("../../models/User.model");

const multer = require("multer");
const storage = require("../../config/multer");
const upload = multer({storage: storage});

// ! ##########################################
// ! GET EVNETS (ALL OR USER EVENTS)
// ! ##########################################
router.get("/:id/:skip-:limit-:visibility-:timestamp", passport.authenticate("jwt", {session: false}), async (req, res) => {
    let ids = [];
    let convertedShortId = await User.findOne({short_id: req.params.id})
    if(convertedShortId)
        ids = [convertedShortId.id]

    if(mongoose.isValidObjectId(req.params.id))
        ids = [req.params.id];

    let startDate = new Date(parseInt(req.params.timestamp));
    let events = [];
    if(ids.length > 0) {
        events = await Event.find({
            owner: {$in: ids},
            createdAt: {$lt: startDate}
        }).sort({
            createdAt: -1,
        }).skip(parseInt(req.params.skip)).limit(parseInt(req.params.limit));
    } else {
        events = await Event.find({
            owner: {$ne: req.user.id},
            createdAt: {$lt: startDate}
        }).sort({
            createdAt: -1,
        }).skip(parseInt(req.params.skip)).limit(parseInt(req.params.limit));
    }

    return res.status(200).json(events);
})

// ! ###############################
// ! GET MOST POPULAR EVENTS
// ! ###############################
router.get('/most-popular/', passport.authenticate("jwt", {session: false}), async (req, res) => {
    let events = await Event.find({
        owner: {$ne: req.user.id},
    }).sort({
        participants: -1,
    }).limit(2);

    return res.status(200).json(events);
})

// ! ###############################
// ! GET USER EVENTS
// ! ###############################
router.get('/user-events/', passport.authenticate("jwt", {session: false}), async (req, res) => {
    let events = await Event.find({
        owner: req.user.id,
    }).select({
        title: 1,
    })

    return res.status(200).json(events);
})

// ! ###############################
// ! GET USER INTERESTED EVENTS
// ! ###############################
router.get('/interested/', passport.authenticate('jwt', {session: false}), async (req, res) => {
    let events = await Event.find({
        owner: {$ne: req.user.id},
        interested: {$in: req.user.id}
    });

    return res.status(200).json(events);
})

// ! ###############################
// ! GET USER PARTICIPANT EVENTS
// ! ###############################
router.get('/participant/', passport.authenticate('jwt', {session: false}), async (req, res) => {
    let events = await Event.find({
        owner: {$ne: req.user.id},
        participants: {$in: req.user.id}
    });

    return res.status(200).json(events);
})

// ! ###############################
// ! GET USER INVITATIONS EVENTS
// ! ###############################
router.get('/invitations/', passport.authenticate("jwt", {session: false}), async (req, res) => {
    let events = await Event.find({
        owner: {$ne: req.user.id},
        invited: {$in: req.user.id}
    }).select({
        title: 1,
    });
    
    return res.status(200).json(events);
})

// ! ##############################
// ! GET EVENT WITH ID
// ! ##############################
router.get("/:id", passport.authenticate("jwt", {session: false}), async(req, res) => {
    const event = await Event.findById(req.params.id);

    if(event) {
        return res.status(200).json({event: event});
    } else {
        return res.status(404).json('error');
    }
})

const validateEventData = require("../../validators/eventAddValidator");
// ! #####################
// ! ADD NEW EVENT
// ! #####################
router.post("/", passport.authenticate("jwt", {session: false}), async (req, res) => {
    const { errors, isCorrect } = validateEventData(req.body);

    if(!isCorrect) {
        return res.status(500).json({errors});
    }

    let event = new Event(req.body);
    event.owner = req.user.id;
    await event.save();

    return res.status(200).json(event._id);
})

// ! #####################
// ! ADD IMAGE TO EVENT
// ! #####################
router.post("/:id/image", passport.authenticate("jwt", {session: false}), upload.single('event-image'), async (req, res) => {
    let event = await Event.findById(req.params.id);

    if(event) {
        event.image = req.file.filename;
        await event.save();
        return res.status(200).json('success');
    } else {
        return res.status(404).json('error');
    }
})

// ! ###############################
// ! UPDATE EVENT
// ! ###############################
router.put("/:id/:type/", passport.authenticate("jwt", {session: false}), async (req, res) => {
    let event = await Event.findById(req.params.id);

    if(event) {
        const type = req.params.type;

        if(type === "interested" || type === "participant") {
            const isInterested = event.interested.includes(req.user.id);
            const isParticipant = event.participants.includes(req.user.id);

            if(isInterested)
                event.interested.splice(event.interested.indexOf(req.user.id), 1);
            if(isParticipant)
                event.participants.splice(event.participants.indexOf(req.user.id), 1);

            if(type === 'interested' && !isInterested) {
                event.interested.push(req.user.id);
            } else if(type === 'participant' && !isParticipant) {
                event.participants.push(req.user.id);
            }
        } else if(type === 'invitation') {
            let friends = await Friend.find({
                friendStatus: 1,
                requester: {$eq: req.user.id},
                recipient: {$in: req.body.ids}
            })
            let friendsMap = friends.map(item => item.recipient);

            for(let friend of friendsMap) {
                if(!event.invited.includes(friend) && event.owner.toString() != friend.toString() && !event.participants.includes(friend))
                    event.invited.push(friend);
            }
        }

        event.save();

        return res.status(200).json(event);
    } else {
        return res.status(404).json('error');
    }
})

// ! ###############################
// ! UPDATE EVENT
// ! ###############################
router.delete('/invitation/:id/', passport.authenticate("jwt", {session: false}), async (req, res) => {
    let event = await Event.findById(req.params.id);

    if(event) {
        event.invited.splice(event.invited.indexOf(req.user.id), 1);
        await event.save();
        
        return res.status(200).json('success');
    } else {
        return res.status(404).json('error');
    }
})

module.exports = router;