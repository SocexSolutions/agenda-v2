const Participant     = require('../models/participant');
const Meeting         = require('../models/meeting');
const { check_owner } = require('../util/authorization');

module.exports = {
  /**
   * Create a participant
   *
   * @param {String} req.body.email - email of participant
   * @param {String} res.body.meeting_id - _id of meeting associated with
   * participant
   *
   * @returns {Promise<Participant>} - created participant
   */
  create: async( req, res ) => {
    const { email, meeting_id } = req.body;

    await check_owner(
      meeting_id,
      'meetings',
      req.credentials
    );

    const participant = await Participant.create({
      email,
      meeting_id
    });

    return res.status( 201 ).send( participant );
  },

  getMeetings: async( req, res ) => {
    const { email } = req.params;

    const participants = await Participant.find({ email });

    const meetingIds = [];

    participants.forEach( ( participant ) => {
      meetingIds.push( participant.meeting_id );
    });

    const query = { _id: { $in: meetingIds } };

    const cursorMeetings = await Meeting.find( query );

    res.status( 200 ).send( cursorMeetings );
  }
};
