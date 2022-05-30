const router                = require('express').Router();
const participantController = require('../controllers/participant');
const { wrapController }    = require('../util/error-wrapper');

const wrapped = wrapController( participantController );

router.post( '/', wrapped.create );
router.get( '/meetings/:email', wrapped.getMeetings );

module.exports = router;
