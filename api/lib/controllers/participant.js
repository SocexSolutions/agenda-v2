const Participant = require('../models/participant');
const Meeting     = require('../models/meeting');

module.exports = {
  create: async( req, res ) => {
    try {
      const { email, meeting_id } = req.body;

      const participant = await Participant.create({
        email,
        meeting_id
      });

      res.status( 201 ).send( participant );
    } catch ( error ) {
      res.status( 500 ).send( error );
    }
  },

  getMeetings: async( req, res ) => {
    try {
      const { email } = req.params;

      const participants = await Participant.find({ email });

      const meetingIds = [];

      participants.forEach( ( participant ) => {
        meetingIds.push( participant.meeting_id );
      });

      const query = { _id: { $in: meetingIds } };

      const cursorMeetings = await Meeting.find( query );

      res.status( 200 ).send( cursorMeetings );
    } catch ( error ) {
      res.status( 500 ).send( error );
    }
  }
};
