const router = require("express").Router();
const meetingResource = require("../controllers/meeting");

router.get("/display", meetingResource.display);

router.post("/create", meetingResource.create);

module.exports = router;
