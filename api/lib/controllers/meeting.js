const mongoose          = require('mongoose');
const Meeting           = require('../models/meeting');
const Topic             = require('../models/topic.js');
const User              = require('../models/user');
const Participant       = require('../models/participant');
const check_participant = require('../auth/check-participant');
const ObjectID          = require('mongoose').Types.ObjectId;
const log               = require('@starryinternet/jobi');

module.exports = {
  /**
   * Get a meeting
   * @param {String} req.params._id - meeting id
   */
  get: async( req, res ) => {
    try {
      const { _id }  = req.params;
      const { user } = req.credentials;

      const { authorized, meeting } = await check_participant( _id, user );

      if ( !authorized ) {
        return res.status( 403 ).send('unauthorized');
      }

      res.status( 200 ).send( meeting );
    } catch ( err ) {
      log.error( err.message );
      res.status( 500 ).send( err );
    }
  },

  /**
   * Create a new meeting
   * @param {String} req.body.name - meeting name
   * @param {Date}   req.body.date - meeting date
   */
  create: async( req, res ) => {
    try {
      const { name, date } = req.body;
      const { sub }        = req.credentials;

      const meeting = await Meeting.create({
        name,
        date,
        owner_id: sub
      });

      res.status( 200 ).send( meeting );
    } catch ( err ) {
      log.error( err.message );
      res.status( 500 ).send( err );
    }
  },

  /**
   * Update an existing meeting
   * @param {String} req.body.name  - meeting name
   * @param {Date}   req.body.date  - meeting date
   * @param {String} req.params._id - meeting id
   */
  update: async( req, res ) => {
    try {
      const { name, date } = req.body;
      const subject_id     = req.credentials.sub;
      const _id            = req.params._id;

      const meeting = await Meeting.findOne({ _id });

      if ( meeting.owner_id.toString() !== subject_id ) {
        return res.status( 403 ).send('unauthorized');
      }

      const updated = await Meeting.findOneAndUpdate(
        { _id },
        { name, date },
        { new: true }
      );

      res.status( 200 ).send( updated );
    } catch ( err ) {
      log.error( err.message );
      res.status( 500 ).send( err );
    }
  },

  /**
   * Get all related meeting data (topics, participants)
   * @param {string} req.params._id - meeting _id
   */
  aggregate: async( req, res ) => {
    const { _id }    = req.params;
    const subject_id = req.credentials.sub;

    try {
      const [ user, [ meeting ] ] = await Promise.all([
        User.findOne({ _id: subject_id }),
        Meeting.aggregate([
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
        ])
      ]);

      const is_owner = meeting.owner_id.toString() === user._id.toString();
      const is_participant = !!meeting.participants.find( participant => {
        return participant.email === user.email;
      });

      if ( !( is_owner || is_participant ) ) {
        return res.status( 403 ).send('unauthorized');
      }

      return res.status( 200 ).send( meeting );

    } catch ( error ) {

      log.error( 'error getting meeting: ' + error.message );
      res.status( 500 ).send( error.message );
    }
  },

  /**
   * Create or update a meeting and all its data
   * @param {String} req.body.name - meeting name
   * @param {String} req.body.date - meeting date
   * @param {Topic[]} req.body.topics - array of Topics
   * @param {Participant[]} req.body.participants - array of Participants
   */
  aggregateSave: async( req, res ) => {
    let session;

    try {
      const name       = req.body.name;
      const date       = req.body.date;
      const owner_id   = req.body.owner_id;
      const meeting_id = req.body.meeting_id || new ObjectID();
      const subject_id = req.credentials.sub;

      let topics       = req.body.topics || null;
      let participants = req.body.participants || null;

      let meeting = await Meeting.findOne({ _id: meeting_id });

      if ( meeting && ( meeting.owner_id.toString() !== subject_id ) ) {
        return res.status( 403 ).send('unauthorized');
      }

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
  },

  async getTopics( req, res ) {
    try {
      const { _id }  = req.params;
      const { user } = req.credentials;

      const { authorized } = await check_participant( _id, user );

      if ( !authorized ) {
        return res.status( 403 ).send('unauthorized');
      }

      const topics = await Topic.find({ meeting_id: _id });

      return res.status( 200 ).send( topics );
    } catch ( err ) {
      log.error( err );
      res.status( 500 ).send( err.message );
    }
  },

  async getParticipants( req, res ) {
    try {
      const { _id }  = req.params;
      const { user } = req.credentials;

      const { authorized } = await check_participant( _id, user );

      if ( !authorized ) {
        return res.status( 403 ).send('unauthorized');
      }

      const participants = await Participant.find({ meeting_id: _id });

      return res.status( 200 ).send( participants );
    } catch ( err ) {
      log.error( err );
      res.status( 500 ).send( err.message );
    }
  }

};
