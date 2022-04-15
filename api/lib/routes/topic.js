const router          = require('express').Router();
const topicController = require('../controllers/topic');

router.post( '/', topicController.create );
router.post( '/:_id', topicController.update );
router.patch( '/:_id/like', topicController.like );
router.patch( '/:_id/status', topicController.status );

module.exports = router;
