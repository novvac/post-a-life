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

router.put("/:id/like/", passport.authenticate("jwt", {session: false}), async (req, res) => {
    let post = await Post.findById(req.params.id);

    if(post) {
        let isAdded = false;
        if(post.likes.includes(req.user.id)) {
            post.likes.splice(post.likes.indexOf(req.user.id), 1);
        } else {
            post.likes.push(req.user.id);
            isAdded = true;
        }

        post.save();
    
        res.status(200).json({added: isAdded});
    } else {
        res.status(404).json({error: "Nie znaleziono posta!"});
    }
})

module.exports = router;