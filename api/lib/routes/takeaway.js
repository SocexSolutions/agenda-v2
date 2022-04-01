const router          = require('express').Router();
const topicController = require('../controllers/takeaway');

router.post( '/', topicController.create );
router.delete( '/:id', topicController.delete );

module.exports = router;
