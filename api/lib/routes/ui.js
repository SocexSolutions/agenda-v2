const router       = require('express').Router();
const uiController = require('../controllers/ui');

router.get( '/:user_id', uiController.get );
router.post( '/', uiController.save );

module.exports = router;
