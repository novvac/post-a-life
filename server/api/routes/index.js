const auth = require("./auth.routing");
const user = require("./user.routing");
const main = require("./main.routing");
const post = require("./post.routing");
const comment = require("./comment.routing");
const event = require("./event.routing");

const express = require("express");
const router = express.Router();

router.use("/auth/", auth);
router.use("/user/", user);
router.use("/main/", main);
router.use("/post/", post);
router.use("/comment/", comment);
router.use("/event/", event);

module.exports = router;