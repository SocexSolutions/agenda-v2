const router = require("express").Router();
const authMdw = require("../middleware/authenticate");
const reqLogger = require("../middleware/req-logger");
const health = require("./health");
const user = require("./user");
const meeting = require("./meeting");
const topic = require("./topic");
const group = require("./group");
const invite = require("./invite");
const tag = require("./tag");
const ui = require("./ui");
const participant = require("./participant");
const takeaway = require("./takeaway");
const actionItem = require("./action-item");
const pubkey = require("./pubkey");
const avatar = require("./avatar")

router.use("/health", health);
router.use("/user", reqLogger, user);
router.use("/meeting", reqLogger, authMdw, meeting);
router.use("/topic", reqLogger, authMdw, topic);
router.use("/takeaway", reqLogger, authMdw, takeaway);
router.use("/action-item", reqLogger, authMdw, actionItem);
router.use("/participant", reqLogger, authMdw, participant);
router.use("/ui", reqLogger, authMdw, ui);
router.use("/group", reqLogger, authMdw, group);
router.use("/invite", reqLogger, authMdw, invite);
router.use("/tag", reqLogger, authMdw, tag);
router.use("/pubkey", reqLogger, pubkey);
router.use("/avatar", reqLogger, authMdw, avatar)

module.exports = router;
