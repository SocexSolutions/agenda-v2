const router             = require('express').Router();
const takeawayController = require('../controllers/takeaway');

router.post( '/', takeawayController.create );
router.delete( '/:id', takeawayController.delete );

module.exports = router;
