const express = require("express");
const router = express.Router();
const passport = require("../../passport/index");
const Post = require("../../models/Post.model");
const Comment = require("../../models/Comment.model");

const validatePostData = require("../../validators/postAddValidator");
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
    
    return res.status(200).send('success');
})

router.post("/posts/", passport.authenticate("jwt", {session: false}), async (req, res) => {
    let startDate = new Date(req.body.timestamp);
    let posts = await Post.find({
        owner: {$in: req.body.ids},
        visibility: {$lte: req.body.visibility},
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

const validateCommentData = require("../../validators/commentAddValidator");
router.post("/:id/comment/", passport.authenticate("jwt", {session: false}), async (req, res) => {
    const { errors, isCorrect } = validateCommentData(req.body);

    if(!isCorrect) {
        return res.status(500).json({errors});
    }

    //////////////////////
    // ? data correct ? //
    //////////////////////

    let post = await Post.findById(req.params.id);

    if(post) {   
        const comment = new Comment({
            text: req.body.comment,
            owner: req.user.id,
            post: post.id,
        })

        post.comments.push(comment);
        comment.save();
        post.save();

        res.status(200).json('success');
    } else {
        res.status(404).json({errors: {comment: "Błąd przy dodawaniu komentarza!"}});
    }
})

router.post("/:id/comments/", passport.authenticate("jwt", {session: false}), async (req, res) => {
    let startDate = new Date(req.body.timestamp);

    let comments = await Comment.find({
        post: {$eq: req.params.id},
        createdAt: {$lt: startDate},
    }).populate({
        path: "owner",
        select: {
            avatar: 1,
            firstName: 1,
            lastName: 1,
            short_id: 1,
            _id: 0,
        }
    }).sort({createdAt: -1}).skip(parseInt(req.body.skip)).limit(parseInt(req.body.limit));
    
    res.status(200).json({comments});
})

module.exports = router;