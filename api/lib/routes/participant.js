const router                 = require('express').Router();
const participant_controller = require('../controllers/participant');
const { wrap_controller }    = require('../util/error-wrapper');

const wrapped = wrap_controller( participant_controller );

router.post( '/', wrapped.create );
router.get( '/meetings/:email', wrapped.getMeetings );

module.exports = router;
