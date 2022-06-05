const router             = require('express').Router();
const topicController    = require('../controllers/topic');
const { wrapController } = require('../util/error-wrapper');

const wrapped = wrapController( topicController );

router.post( '/', wrapped.create );
router.patch( '/:_id', wrapped.update );
router.patch( '/:_id/like', wrapped.like );
router.patch( '/:_id/status', wrapped.status );
router.get( '/:_id/takeaways', wrapped.getTakeaways );

module.exports = router;
