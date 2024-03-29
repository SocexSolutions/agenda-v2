const router = require("express").Router();
const userController = require("../controllers/user");
const authMdw = require("../middleware/authenticate");
const { wrapController } = require("../util/error-wrapper");

const wrapped = wrapController(userController);

router.post("/register", wrapped.register);
router.post("/login", wrapped.login);
router.post("/checkexistingusername", wrapped.checkExistingUsername);
router.post("/checkexistingemail", wrapped.checkExistingEmail);
router.post("/reset-request", wrapped.resetRequest);
router.post("/reset-password", wrapped.resetPassword);
router.get("/refresh", authMdw, wrapped.refresh);
router.get("/:_id/groups", authMdw, wrapped.groups);
router.get("/:_id/actionitems", authMdw, wrapped.actionItems);

module.exports = router;
