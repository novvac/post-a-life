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

module.exports = router;