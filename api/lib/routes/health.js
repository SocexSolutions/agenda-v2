const router           = require('express').Router();
const healthController = require('../controllers/health');

router.get( '/', healthController.health );

module.exports = router;
