const router = require("express").Router();
const participantController = require("../controllers/participant");

router.post("/create", participantController.create);

module.exports = router;