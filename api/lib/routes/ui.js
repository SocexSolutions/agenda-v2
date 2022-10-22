const router = require("express").Router();
const uiController = require("../controllers/ui");
const { wrapController } = require("../util/error-wrapper");

const wrapped = wrapController(uiController);

router.get("/:user_id", wrapped.get);
router.post("/", wrapped.save);

module.exports = router;
