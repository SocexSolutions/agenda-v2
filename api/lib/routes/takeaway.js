const router             = require('express').Router();
const takeawayController = require('../controllers/takeaway');

router.post( '/', takeawayController.create );
router.patch( '/:id', takeawayController.update );
router.delete( '/:id', takeawayController.delete );

module.exports = router;
