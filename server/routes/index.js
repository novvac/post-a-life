const auth = require("../routes/auth.routing");
const user = require("../routes/user.routing");
const main = require("../routes/main.routing");
const post = require("../routes/post.routing");
const comment = require("../routes/comment.routing");
const event = require("../routes/event.routing");

const express = require("express");
const router = express.Router();

router.use("/auth/", auth);
router.use("/user/", user);
router.use("/main/", main);
router.use("/post/", post);
router.use("/comment/", comment);
router.use("/event/", event);

module.exports = router;