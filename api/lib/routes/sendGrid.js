const router = require( "express" ).Router();
const sendGrid = require( "../sendGrid/sendGrid" );

router.post( "/welcomeemail", sendGrid.sendWelcomeEmail );

module.exports = router;
