const mongoose    = require('mongoose');
const Meeting     = require('../models/meeting');
const Topic       = require('../models/topic.js');
const Participant = require('../models/participant');
const ObjectID    = require('mongoose').Types.ObjectId;
const logger      = require('@starryinternet/jobi');

module.exports = {
  index: async( req, res ) => {
    logger.debug('meeting index route');

    try {
      const meetings = await Meeting.find({});

      logger.debug( 'response: ' + JSON.stringify( meetings ) );
      res.status( 200 ).send( meetings );

    } catch ( error ) {

      logger.error( 'Meeting index failed: ' + error.message );
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
    logger.debug( 'display meeting ' + JSON.stringify( req.params ) );

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

      logger.debug( 'found: ' + JSON.stringify( meeting ) );
      res.status( 200 ).send( meeting );

    } catch ( error ) {

      logger.error( 'error getting meeting: ' + error.message );
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
    logger.debug('#save controllers/meeting');
    let session;

    try {
      const name       = req.body.name;
      const date       = req.body.date;
      const owner_id   = req.body.ownerId;
      const meeting_id = req.body.meeting_id || new ObjectID();

      let topics       = req.body.topics || null;
      let participants = req.body.participants || null;

      let meeting;

      session = await mongoose.connection.startSession();

      await session.withTransaction( async() => {

        logger.debug('creating meeting');

        meeting = await Meeting.findOneAndUpdate(
          { _id: meeting_id },
          { name, date, owner_id },
          {
            upsert: true,
            new: true
          }
        );

        if ( topics ) {
          topics = await Topic.saveMeetingTopics({
            meeting_id: meeting._id,
            savedTopics: topics
          });
        } else {
          await Topic.deleteMany({ meeting_id: meeting._id });

          topics = [];
        }

        await Participant.deleteMany({ meeting_id: meeting._id });

        if ( participants ) {
          logger.debug(
            'adding participants: ' + JSON.stringify( participants )
          );

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

      logger.debug( 'meeting: ' + JSON.stringify({
        date, owner_id, topics, participants
      }) );

      res.status( 201 ).send({
        _id: meeting._id,
        name: meeting.name,
        date: meeting.date,
        owner_id: meeting.owner_id,
        topics,
        participants
      });

    } catch ( error ) {
      logger.error( error.message );

      res.status( 500 ).send( error.message );
    } finally {
      session.endSession();
    }
  }

};
