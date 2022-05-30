const router              = require('express').Router();
const topic_controller    = require('../controllers/topic');
const { wrap_controller } = require('../util/error-wrapper');

const wrapped = wrap_controller( topic_controller );

router.post( '/', wrapped.create );
router.post( '/:_id', wrapped.update );
router.patch( '/:_id/like', wrapped.like );
router.patch( '/:_id/status', wrapped.status );
router.get( '/:_id/takeaways', wrapped.getTakeaways );

module.exports = router;
