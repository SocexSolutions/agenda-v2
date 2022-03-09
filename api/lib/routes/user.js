const router         = require('express').Router();
const userController = require('../controllers/user');

router.post( '/register', userController.register );

router.post( '/login', userController.login );

router.post( '/checkexistingusername', userController.checkExistingUsername );

router.post( '/checkexistingemail', userController.checkExistingEmail );

router.get( '/refresh', userController.refresh );

router.get( '/meetings/:_id', userController.getOwnedMeetings );

module.exports = router;
