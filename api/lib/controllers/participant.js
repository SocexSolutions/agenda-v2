const Participant = require( "../models/participant" );
const logger      = require( "@starryinternet/jobi" );

module.exports = {
  create: async( req, res ) => {
    logger.debug( "creating participant " + JSON.stringify( req.body ) );
    const { email, meeting_id } = req.body;

    try {
      const participant = await Participant.create({
        email,
        meeting_id,
      });

      logger.debug( "participant created " + JSON.stringify( participant ) );
      res.status( 201 ).send( participant );
    } catch ( error ) {
      res.status( 500 ).send( error );
    }
  },
};
