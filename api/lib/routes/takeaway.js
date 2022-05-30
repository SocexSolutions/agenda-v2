const router             = require('express').Router();
const takeawayController = require('../controllers/takeaway');
const { wrapController } = require('../util/error-wrapper');

const wrapped = wrapController( takeawayController );

router.post( '/', wrapped.create );
router.patch( '/:id', wrapped.update );
router.delete( '/:id', wrapped.delete );

module.exports = router;
