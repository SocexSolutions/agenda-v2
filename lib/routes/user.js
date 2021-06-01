const router = require( "express" ).Router();
const userResource = require( "../controllers/user" );

router.post( "/create", userResource.create );

module.exports = router;
