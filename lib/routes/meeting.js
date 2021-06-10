const router = require("express").Router();
const meetingController = require("../controllers/meeting");

router.get("/display", meetingController.display);

router.post("/create", meetingController.create);

module.exports = router;
