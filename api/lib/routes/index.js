const router      = require('express').Router();
const auth        = require('../middleware/authenticate');
const reqLogger   = require('../middleware/req-logger');
const health      = require('./health');
const user        = require('./user');
const meeting     = require('./meeting');
const topic       = require('./topic');
const ui          = require('./ui');
const participant = require('./participant');

router.use( '/health', health );
router.use( '/user', reqLogger, user );
router.use( '/meeting', reqLogger, auth, meeting );
router.use( '/topic', reqLogger, auth, topic );
router.use( '/participant', reqLogger, auth, participant );
router.use( '/ui', reqLogger, auth, ui );

module.exports = router;
