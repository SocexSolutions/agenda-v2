const mongoose    = require('mongoose');
const Meeting     = require('../models/meeting');
const Topic       = require('../models/topic.js');
const Participant = require('../models/participant');
const ObjectID    = require('mongoose').Types.ObjectId;
const log         = require('@starryinternet/jobi');

module.exports = {
  index: async( req, res ) => {
    try {
      const meetings = await Meeting.find({});
      res.status( 200 ).send( meetings );
    } catch ( error ) {
      log.error( 'Meeting index failed: ' + error.message );
      res.status( 500 ).send( error.message );
    }
  },

  /**
   * Get all related meeting data (topics, participants)
   * @param {Object} req - request object
   * @param {Object[]} req.params._id - meeting _id to lookup
   * participants model
   * @param {Object} res - response object
   * @returns {Promise<Object>} created meeting data corresponding to params
   */
  display: async( req, res ) => {
    const { _id } = req.params;

    try {
      const meeting = await Meeting.aggregate([
        {
          $match: {
            _id: new ObjectID( _id )
          }
        },
        {
          $lookup: {
            from: 'participants',
            localField: '_id',
            foreignField: 'meeting_id',
            as: 'participants'
          }
        },
        {
          $lookup: {
            from: 'topics',
            localField: '_id',
            foreignField: 'meeting_id',
            as: 'topics'
          }
        }
      ]);

      res.status( 200 ).send({ ...meeting });

    } catch ( error ) {

      log.error( 'error getting meeting: ' + error.message );
      res.status( 500 ).send( error.message );
    }
  },

  /**
   * Create or update a meeting
   * @param {string} req.body.name - meeting name
   * @param {string} req.body.date - meeting date
   * @param {string} req.body.ownerId - meeting owner's id
   * @param {Object[]} req.body.topics - topics array that fits the topics model
   * @param {Object[]} req.body.participants - participants array that fits the
   * participants model
   * @param {Object} res - response object
   * @returns {Promise<Object>} created meeting data corresponding to params
   */
  save: async( req, res ) => {
    let session;

    try {
      const name       = req.body.name;
      const date       = req.body.date;
      const owner_id   = req.body.owner_id;
      const meeting_id = req.body.meeting_id || new ObjectID();
      const subject_id = req.credentials.sub;

      let topics       = req.body.topics || null;
      let participants = req.body.participants || null;

      let meeting;

      session = await mongoose.connection.startSession();

      await session.withTransaction( async() => {

        meeting = await Meeting.findOneAndUpdate(
          { _id: meeting_id },
          { name, owner_id, date },
          {
            upsert: true,
            new: true
          }
        );

        if ( topics ) {
          topics = await Topic.saveMeetingTopics({
            meeting_id: meeting._id,
            savedTopics: topics,
            subject_id
          });
        } else {
          await Topic.deleteMany({ meeting_id: meeting._id });

          topics = [];
        }

        await Participant.deleteMany({ meeting_id: meeting._id });

        if ( participants ) {
          const formattedParticipants = participants.map( participant => {
            return {
              email: participant.email,
              meeting_id: meeting._id
            };
          });

          await Participant.insertMany( formattedParticipants );
        }

        participants = await Participant.find({ meeting_id: meeting._id });
      });

      res.status( 201 ).send({
        _id: meeting._id,
        name: meeting.name,
        date: meeting.date,
        owner_id: meeting.owner_id,
        topics,
        participants
      });

    } catch ( error ) {
      log.error( error.message );

      res.status( 500 ).send( error.message );
    } finally {
      session.endSession();
    }
  }

};
