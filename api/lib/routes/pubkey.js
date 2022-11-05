const router = require("express").Router();
const keyController = require("../controllers/pubkey");
const { wrapController } = require("../util/error-wrapper");

const wrapped = wrapController(keyController);

router.get("/", wrapped.pubkey);

module.exports = router;
