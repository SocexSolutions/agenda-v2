const router = require( "express" ).Router();
const groupController = require( "../controllers/group" );

router.get( "/:_id", groupController.display );

router.post( "/", groupController.create );

module.exports = router;
