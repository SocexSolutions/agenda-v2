const router              = require('express').Router();
const meeting_controller  = require('../controllers/meeting');
const { wrap_controller } = require('../util/error-wrapper');

const wrapped = wrap_controller( meeting_controller );

router.get( '/:_id', wrapped.get );
router.post( '/', wrapped.create );
router.patch( '/:_id', wrapped.update );
router.get( '/:_id/aggregate', wrapped.aggregate );
router.post( '/aggregate', wrapped.aggregateSave );
router.get( '/:_id/topics', wrapped.getTopics );
router.get( '/:_id/participants', wrapped.getParticipants );

module.exports = router;
