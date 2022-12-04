const router = require("express").Router();
const avatarController = require("../controllers/avatar");
const { wrapController } = require("../util/error-wrapper");

const wrapped = wrapController(avatarController);

router.post("/", wrapped.create);
router.get("/", wrapped.get);

module.exports = router;
