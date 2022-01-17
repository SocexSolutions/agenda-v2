const mongoose    = require('mongoose');
const Meeting     = require('../models/meeting');
const Topic       = require('../models/topic');
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

      res.status( 200 ).send( meeting );

    } catch ( error ) {

      log.error( 'error getting meeting: ' + error.message );
      res.status( 500 ).send( error.message );
    }
  },

  /**
   * Create a meeting
   * @param {Object} req - request object
   * @param {string} req.body.name - meeting name
   * @param {string} req.body.date - meeting date
   * @param {string} req.body.owner_id - meeting owner's id
   * @param {Object[]} req.body.topics - topics array that fits the topics model
   * @param {Object[]} req.body.participants - participants array that fits the
   * participants model
   * @param {Object} res - response object
   * @returns {Promise<Object>} created meeting data corresponding to params
   */
  create: async( req, res ) => {
    let session;

    try {
      const name        = req.body.name;
      const date        = req.body.date;
      const owner_id    = req.body.owner_id;

      let topics       = req.body.topics || null;
      let participants = req.body.participants || null;

      session = await mongoose.connection.startSession();

      await session.withTransaction( async() => {

        const meeting = await Meeting.create({
          name,
          date,
          owner_id
        });

        if ( topics ) {
          topics = topics.map( topic => {
            return { name: topic, meeting_id: meeting._id };
          });

          topics = await Topic.insertMany( topics );
        }

        if ( participants ) {
          participants = participants.map( participant => {
            return { email: participant, meeting_id: meeting._id };
          });

          participants = await Participant.insertMany( participants );
        }
      });

      res.status( 201 ).send({
        owner_id,
        name,
        date,
        topics,
        participants
      });

    } catch ( error ) {
      log.error( error.message );
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

      res.status( 201 ).send({
        meeting,
        topics,
        participants
      });

    } catch ( error ) {
      log.error( 'error updating meeting ' + error.message );
      res.status( 500 ).send( error.message );
    } finally {
      session.endSession();
    }
  }
};
