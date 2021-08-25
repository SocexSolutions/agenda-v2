const router = require( "express" ).Router();
const topicController = require( "../controllers/topic" );

router.post( "/create", topicController.create );

module.exports = router;