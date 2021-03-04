const express = require("express");
const router = express.Router();
const passport = require("../../passport/index");
const Event = require("../../models/Event.model");

const multer = require("multer");
const storage = require("../../config/multer");
const upload = multer({storage: storage});

// ! ###############################
// ! GET USER EVENTS
// ! ###############################
router.get('/', passport.authenticate("jwt", {session: false}), async (req, res) => {
    let events = await Event.find({
        owner: req.user.id,
    }).select({
        title: 1,
    })

    return res.status(200).json({events: events});
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

module.exports = router;