const router            = require( "express" ).Router();
const meetingController = require( "../controllers/meeting" );

router.get( "/", meetingController.index );
router.get( "/:_id", meetingController.display );
router.post( "/", meetingController.create );

module.exports = router;
