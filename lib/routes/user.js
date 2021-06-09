const router = require( "express" ).Router();
const userController = require( "../controllers/user" );

router.post( "/create", userController.create );

module.exports = router;
