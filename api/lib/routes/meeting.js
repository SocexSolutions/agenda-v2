const router            = require('express').Router();
const meetingController = require('../controllers/meeting');

router.get( '/:_id', meetingController.get );
router.post( '/', meetingController.create );
router.patch( '/:_id', meetingController.update );
router.get( '/:_id/aggregate', meetingController.aggregate );
router.post( '/aggregate', meetingController.aggregateSave );
router.get( '/:_id/topics', meetingController.getTopics );
router.get( '/:_id/participants', meetingController.getParticipants );

module.exports = router;
