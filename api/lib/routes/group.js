const router = require("express").Router();
const groupController = require("../controllers/group");
const { wrapController } = require("../util/error-wrapper");

const wrapped = wrapController(groupController);

router.post("/", wrapped.create);
router.patch("/:_id", wrapped.update);

module.exports = router;
