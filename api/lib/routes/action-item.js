const router = require("express").Router();
const actionItemController = require("../controllers/action-item");
const { wrapController } = require("../util/error-wrapper");

const wrapped = wrapController(actionItemController);

router.post("/", wrapped.create);
router.patch("/:id", wrapped.update);
router.delete("/:id", wrapped.delete);

module.exports = router;
