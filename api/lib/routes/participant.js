const router = require( "express" ).Router();
const participantController = require( "../controllers/participant" );

router.post( "/", participantController.create );

module.exports = router;
