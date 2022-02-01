const router                = require('express').Router();
const participantController = require('../controllers/participant');

router.post( '/', participantController.create );
router.get( '/meetings/:email', participantController.getMeetings );

module.exports = router;
