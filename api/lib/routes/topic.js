const router = require("express").Router();
const topicController = require("../controllers/topic");
const { wrapController } = require("../util/error-wrapper");

const wrapped = wrapController(topicController);

router.post("/", wrapped.create);
router.patch("/:_id", wrapped.update);
router.delete("/:_id", wrapped.delete);
router.patch("/:_id/like", wrapped.like);
router.patch("/:_id/close", wrapped.close);
router.patch("/:_id/reopen", wrapped.reOpen);
router.get("/:_id/takeaways", wrapped.getTakeaways);
router.get("/:_id/action-items", wrapped.getActionItems);

module.exports = router;
