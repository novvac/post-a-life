const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const passport = require("../passport/index");

router.get("/fast-search/:query", passport.authenticate("jwt", {session: false}), (req, res) => {
    const query = req.params.query.split(" ");
    let regex = [];
    for(let word of query) {
        regex.push(new RegExp(word, "i"));
    }
    User.find({$or: [{firstName: regex}, {lastName: regex}, {short_id: regex}]}, {}, {limit: 5}, (err, docs) => {
            let dataToSend = [];
            for(doc of docs) {
                let {_id, email, password, __v, ...result} = doc._doc;

                if(result.short_id != req.user.short_id) {
                    dataToSend.push(result);
                }
            }

            if(dataToSend.length > 0)
                res.status(200).json({data: dataToSend});
            else
                res.status(404).send("Nie znaleziono!");
    })
})

module.exports = router;