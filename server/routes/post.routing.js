const express = require("express");
const router = express.Router();
const passport = require("../passport/index");
const Post = require("../models/Post.model");

const validatePostData = require("../validators/postAddValidator");
router.post("/", passport.authenticate("jwt", {session: false}), async (req, res) => {
    const { errors, isCorrect } = validatePostData(req.body);

    if(!isCorrect) {
        return res.status(500).json({errors});
    }

    //////////////////////
    // ? data correct ? //
    //////////////////////

    let post = new Post(req.body);
    post.owner = req.user.id;
    post.save();

    // TODO: spam protector
    // TODO: image(s) upload system
    
    return res.status(200).send(post);
})

router.post("/posts/", passport.authenticate("jwt", {session: false}), async (req, res) => {
    let startDate = new Date(req.body.timestamp);
    let posts = await Post.find({
        owner: {$in: req.body.ids},
        createdAt: {$lt: startDate}
    }).populate({
        path: "owner",
        select: {
            avatar: 1,
            firstName: 1,
            lastName: 1,
            short_id: 1,
        },
    }).sort({
        createdAt: -1,
    }).skip(parseInt(req.body.skip)).limit(parseInt(req.body.limit));
    
    res.status(200).json({posts: posts});
})

module.exports = router;