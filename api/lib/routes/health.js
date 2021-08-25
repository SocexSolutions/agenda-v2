const router           = require( "express" ).Router();
const healthController = require( "../controllers/health" );
const authenticate     = require( "../middleware/authenticate" );

router.get( "/", authenticate, healthController.health );

module.exports = router;