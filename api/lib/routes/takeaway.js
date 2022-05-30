const router              = require('express').Router();
const takeaway_controller = require('../controllers/takeaway');
const { wrap_controller } = require('../util/error-wrapper');

const wrapped = wrap_controller( takeaway_controller );

router.post( '/', wrapped.create );
router.patch( '/:id', wrapped.update );
router.delete( '/:id', wrapped.delete );

module.exports = router;
