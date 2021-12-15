const Participant = require( "../models/participant" );
const Meeting     = require( "../models/meeting" );
const logger      = require( "@starryinternet/jobi" );
const mongoose    = require( "mongoose" );

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

    const conn = mongoose.connection;
    const col = conn.collection( "meetings" );

    const { email } = req.body;
    const participantMeetings = new Array;

    try{
      const participants = await Participant.find({ email });

      let meetingIds = new Array();

      participants.forEach( ( participant ) => {
        meetingIds.push( participant.meeting_id );
      });

      const query = { _id: { $in: meetingIds } };

      const cursorMeetings = await col.find( query, {}).toArray();

      logger.debug(
        "participant meetings found " + JSON.stringify( cursorMeetings )
      );
      res.status( 201 ).send( cursorMeetings );
    }
    catch( error ) {
      res.status( 500 ).send( error );
    }
    finally {
      await conn.disconnect();
    }
  }
};
