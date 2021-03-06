const express = require("express");
const router = express.Router();
const passport = require("../../passport/index");
const Event = require("../../models/Event.model");

const multer = require("multer");
const storage = require("../../config/multer");
const upload = multer({storage: storage});

// ! ##########################################
// ! GET ALL EVENTS (WITHOUT LOGGED USER)
// ! ##########################################
router.get("/:skip-:limit-:visibility-:timestamp", passport.authenticate("jwt", {session: false}), async (req, res) => {
    let startDate = new Date(parseInt(req.params.timestamp));
    let events = await Event.find({
        owner: {$ne: req.user.id},
        createdAt: {$lt: startDate}
    }).sort({
        createdAt: -1,
    }).skip(parseInt(req.params.skip)).limit(parseInt(req.params.limit));;

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
router.put("/:id/:type", passport.authenticate("jwt", {session: false}), async (req, res) => {
    let event = await Event.findById(req.params.id);

    if(event) {
        const type = req.params.type;

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

        await event.save();

        return res.status(200).json(event);
    } else {
        return res.status(404).json('error');
    }
})

module.exports = router;