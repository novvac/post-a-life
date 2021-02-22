const express = require("express");
const router = express.Router();
const passport = require("../passport/index");
const Comment = require("../models/Comment.model");

const validateCommentData = require("../validators/commentAddValidator");
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
            owner: req.user.id
        })
    
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
    console.log(startDate);
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

module.exports = router;