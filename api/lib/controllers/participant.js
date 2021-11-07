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
  getMeetings: async( req, res ) => {
    logger.debug( "finding meetings " + JSON.stringify( req.params ) );

    const { email } = req.params;
    const participantMeetings = new Array;

    try{
      const participant = Participant.find( email );

      participant.forEach( ( element ) => {
        participantMeetings.push( element.meeting_id );
      });

      logger.debug(
        "participant meetings found " + JSON.stringify( participantMeetings )
      );
      res.status( 201 ).send( participantMeetings );
    }
    catch( error ) {
      res.status( 500 ).send( error );
    }
  }
};
