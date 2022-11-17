const router = require("express").Router();
const tagController = require("../controllers/tag");
const { wrapController } = require("../util/error-wrapper");

const wrapped = wrapController(tagController);

router.post("/", wrapped.create);

module.exports = router;
