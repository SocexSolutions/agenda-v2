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
    let session;

    try {
      logger.debug( 'create meeting req.body: ' + JSON.stringify( req.body ) );

      const name       = req.body.name;
      const date       = req.body.date;
      const owner_id   = req.body.ownerId;
      const meeting_id = req.body.meeting_id || new ObjectID();

      let topics       = req.body.topics || null;
      let participants = req.body.participants || null;

      let meeting;

      session = await mongoose.connection.startSession();

      await session.withTransaction( async() => {

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
        }

        if ( participants ) {

          participants = participants.map( participant => {
            return {
              email: participant.email,
              meeting_id: meeting._id
            };
          });

          const participantsUpdates = participants.map( participant => {
            return {
              updateOne: {
                filter: {
                  email: participant.email,
                  meeting_id: meeting._id
                },
                update: {
                  $set: participant
                },
                upsert: true
              }
            };
          });

          await Participant.bulkWrite( participantsUpdates );
        }

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
      logger.log( 'error', error.message );

      res.status( 500 ).send( error.message );
    } finally {
      session.endSession();
    }
  },

  /**
   * Update a meeting
   * @param {Object} req - request object
   * @param {string} req.body._id - mongodb _id of meeting to be updated
   * @param {string} req.body.name - meeting name
   * @param {string} req.body.date - meeting date
   * @param {string} req.body.owner_id - meeting owner's id
   * @param {Object[]} req.body.topics - topics array that fits the topics model
   * @param {Object[]} req.body.participants - participants array that fits the
   * participants model
   * @param {Object} res - response object
   * @returns {Promise<Object>} created meeting data corresponding to params
   */
  update: async( req, res ) => {
    let session;

    try {
      logger.debug( 'update meeting req.body: ' + JSON.stringify( req.body ) );

      const {
        _id,
        name,
        date,
        owner_id
      } = req.body.meeting;

      let topics       = req.body.topics || null;
      let participants = req.body.participants || null;
      let meeting;

      session = await mongoose.connection.startSession();

      await session.withTransaction( async() => {

        meeting = await Meeting.findOneAndUpdate(
          { _id },
          { name, date, owner_id },
          {
            useFindAndModify: false,
            new: true
          }
        );

        if ( topics ) {
          await Participant.deleteMany({ meeting_id: meeting._id });

          topics = topics.map( topic => {
            return {
              name: topic.name,
              meeting_id: meeting._id,
              likes: topic.likes || []
            };
          });

          topics = await Topic.insertMany( topics );
        }

        if ( participants ) {
          await Participant.deleteMany({ meeting_id: meeting._id });

          participants = participants.map( participant => {
            return {
              email: participant.email,
              meeting_id: meeting._id
            };
          });

          participants = await Participant.insertMany( participants );
        }
      });

      logger.debug('meeting transaction completed');
      logger.debug( 'meeting: ' + JSON.stringify( meeting ) );
      logger.debug( 'topics: ' + JSON.stringify( topics ) );
      logger.debug( 'participants: ' + JSON.stringify( participants ) );

      res.status( 201 ).send({
        meeting,
        topics,
        participants
      });

    } catch ( error ) {

      logger.error( 'error updating meeting ' + error.message );
      res.status( 500 ).send( error.message );
    } finally {
      session.endSession();
    }
  }
};
