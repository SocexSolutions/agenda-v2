const Participant    = require('../models/participant');
const Meeting        = require('../models/meeting');
const ObjectId       = require('mongoose').Types.ObjectId;
const { checkOwner } = require('../util/authorization');

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

    await checkOwner(
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

  /**
   * Delete a participant
   *
   * @param {String} req.params.id - id of participant to delete
   */
  delete: async( req, res ) => {
    const { id } = req.params;

    const { meeting_id } = await Participant.findOne({ _id: id });

    await checkOwner(
      meeting_id,
      'meetings',
      req.credentials
    );

    await Participant.deleteOne({ _id: id });

    return res.status( 204 ).send();
  },

  getMeetings: async( req, res ) => {
    const { email } = req.params;
    const { owner_id } = req.query;
    const { name } = req.query;

    const participants = await Participant.find({ email });

    const meetingIds = [];

    participants.forEach( ( participant ) => {
      meetingIds.push( participant.meeting_id );
    });

    //build query for optional search filters:
    const queries = [];
    owner_id && queries.push({ owner_id: ObjectId( owner_id ) });
    name     && queries.push({ name });

    const pipeline = [
      { $match: {
        $and: [
          { _id: { '$in': meetingIds } },
          ...queries
        ]
      } }
    ];

    const cursorMeetings = await Meeting.aggregate( pipeline );

    res.status( 200 ).send( cursorMeetings );
  }
};
