const express = require("express");
const router = express.Router();
const passport = require("../../passport/index");
const Comment = require("../../models/Comment.model");
const Post = require("../../models/Post.model");

const validateCommentData = require("../../validators/commentAddValidator");
router.post("/:id/sub-comment/", passport.authenticate("jwt", {session: false}), async (req, res) => {
    const { errors, isCorrect } = validateCommentData(req.body);

    if(!isCorrect) {
        return res.status(500).json({errors});
    }

    //////////////////////
    // ? data correct ? //
    //////////////////////

    let comment = await Comment.findById(req.params.id);

    if(comment) {
        let subcomment = await new Comment({
            text: req.body.comment,
            owner: req.user.id,
        })

        subcomment.subComments = null;
    
        comment.subComments.push(subcomment._id);
        subcomment.save();
        comment.save();

        return res.status(200).json('success');
    } else {
        return res.status(404).json({errors: {comment: "Nie udało się dodać komentarza!"}});
    }
})

router.get("/:id/sub-comments/:skip-:limit/:timestamp", passport.authenticate("jwt", {session: false}), async (req, res) => {
    let startDate = new Date(parseInt(req.params.timestamp));    
    let comment = await Comment.find({
        _id: req.params.id,
    }, {
        subComments: 1,
        createdAt: 1,
    }).populate({
        path: "subComments",
        select: {
            dislikes: 1,
            likes: 1,
            owner: 1,
            text: 1,
            createdAt: 1
        },
        match: {
            createdAt: {$lt: startDate}
        },
        options: {
            limit: parseInt(req.params.limit),
            skip: parseInt(req.params.skip),
            sort: {createdAt: -1}
        },
        populate: {
            path: "owner",
            select: {
                avatar: 1,
                firstName: 1,
                lastName: 1,
                short_id: 1,
                _id: 0,
            }
        }
    })

    comment = comment[0];

    if(comment) {
        res.status(200).json({subComments: comment.subComments});
    } else {
        res.status(404).json('error');
    }
})

router.put("/:id/vote/:type/", passport.authenticate("jwt", {session: false}), async (req, res) => {
    let comment = await Comment.findById(req.params.id);

    if(comment) {
        const type = req.params.type;

        const userLike = comment.likes.includes(req.user.id);
        const userDislike = comment.dislikes.includes(req.user.id);

        comment.likes.splice(comment.likes.indexOf(req.user.id), 1);
        comment.dislikes.splice(comment.dislikes.indexOf(req.user.id), 1);

        if(type == 1) {
            if(!userLike)
                comment.likes.push(req.user.id);
        }
        else if(type == -1) {
            if(!userDislike)
                comment.dislikes.push(req.user.id);
        }

        comment.save();
        
        res.status(200).json('success');
    } else {
        res.status(404).json('error');
    }
})

router.delete("/:id/", passport.authenticate("jwt", {session: false}), async (req, res) => {
    let comment = await Comment.findById(req.params.id).populate({
        path: "owner",
        select: {
            _id: 1,
        }
    });

    if(comment) {
        if(comment.owner.id === req.user.id) {
            let post = await Post.findById(comment.post);
            if(post) {
                post.comments.splice(post.comments.indexOf(comment.id), 1);
                post.save();
            }

            if(comment.subComments === null) {
                let parentComment = await Comment.findOne({
                    subComments: {$in: comment.id}
                })
                if(parentComment) {
                    parentComment.subComments.splice(parentComment.subComments.indexOf(comment.id), 1);
                    parentComment.save();
                }
            } else { 
                await Comment.deleteMany({
                    _id: {$in: comment.subComments}
                })
            }

            await Comment.deleteOne({_id: req.params.id})

            return res.status(200).json("success");
        } else {
            return res.status(418).json('error');
        }
    } else {
        return res.status(404).json('not found');
    }
})

module.exports = router;