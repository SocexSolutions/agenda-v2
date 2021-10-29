const router      = require( "express" ).Router();

const health      = require( "./health" );
const user        = require( "./user" );
const meeting     = require( "./meeting" );
const topic       = require( "./topic" );
const participant = require( "./participant" );
const sendGrid = require( "./sendGrid" );

router.use( "/health", health );
router.use( "/user", user );
router.use( "/meeting", meeting );
router.use( "/topic", topic );
router.use( "/participant", participant );
router.use( "/sendgrid", sendGrid );

module.exports = router;