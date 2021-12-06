const router = require('express').Router();
const auth   = require('../middleware/authenticate');

const health      = require('./health');
const user        = require('./user');
const meeting     = require('./meeting');
const topic       = require('./topic');
const participant = require('./participant');

router.use( '/health', health );
router.use( '/user', user );
router.use( '/meeting', auth, meeting );
router.use( '/topic', auth, topic );
router.use( '/participant', auth, participant );

module.exports = router;
