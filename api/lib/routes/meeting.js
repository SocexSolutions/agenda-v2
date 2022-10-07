const router             = require('express').Router();
const meetingController  = require('../controllers/meeting');
const { wrapController } = require('../util/error-wrapper');

const wrapped = wrapController( meetingController );

router.get( '/:_id', wrapped.get );
router.get( '/', wrapped.index );
router.post( '/', wrapped.create );
router.patch( '/:_id', wrapped.update );
router.get( '/:_id/aggregate', wrapped.aggregate );
router.post( '/aggregate', wrapped.aggregateSave );
router.get( '/:_id/topics', wrapped.getTopics );
router.get( '/:_id/participants', wrapped.getParticipants );
router.patch( '/:_id/status', wrapped.updateStatus );

module.exports = router;
