const router = require( "express" ).Router();
const topicController = require( "../controllers/topic" );

router.post( "/", topicController.create );

module.exports = router;
