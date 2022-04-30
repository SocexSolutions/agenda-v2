const router            = require('express').Router();
const meetingController = require('../controllers/meeting');

router.get( '/', meetingController.index );
router.get( '/:_id', meetingController.display );
router.post( '/', meetingController.save );
router.get( '/:_id/topics', meetingController.getTopics );
router.get( '/:_id/participants', meetingController.getParticipants );

module.exports = router;
