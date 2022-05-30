const router              = require('express').Router();
const user_controller     = require('../controllers/user');
const { wrap_controller } = require('../util/error-wrapper');

const wrapped = wrap_controller( user_controller );

router.post( '/register', wrapped.register );
router.post( '/login', wrapped.login );
router.post( '/checkexistingusername', wrapped.checkExistingUsername );
router.post( '/checkexistingemail', wrapped.checkExistingEmail );
router.get( '/refresh', wrapped.refresh );
router.get( '/meetings/:_id', wrapped.getOwnedMeetings );

module.exports = router;
