const router = require("express").Router();
const inviteController = require("../controllers/invite");
const { wrapController } = require("../util/error-wrapper");

const wrapped = wrapController(inviteController);

router.post("/", wrapped.create);

module.exports = router;
