const router = require("express").Router();
const authMdw = require("../middleware/authenticate");
const reqLogger = require("../middleware/req-logger");
const health = require("./health");
const user = require("./user");
const meeting = require("./meeting");
const topic = require("./topic");
const ui = require("./ui");
const participant = require("./participant");
const takeaway = require("./takeaway");
const actionItem = require("./action-item");

router.use("/health", health);
router.use("/user", reqLogger, user);
router.use("/meeting", reqLogger, authMdw, meeting);
router.use("/topic", reqLogger, authMdw, topic);
router.use("/takeaway", reqLogger, authMdw, takeaway);
router.use("/action-item", reqLogger, authMdw, actionItem);
router.use("/participant", reqLogger, authMdw, participant);
router.use("/ui", reqLogger, authMdw, ui);

module.exports = router;
