const mongoose    = require('mongoose');
const Meeting     = require('../models/meeting');
const Topic       = require('../models/topic.js');
const Participant = require('../models/participant');
const ObjectID    = require('mongoose').Types.ObjectId;
const jobi        = require('@starryinternet/jobi');
const authUtils   = require('../util/authorization');

module.exports = {
  /**
   * Get a meeting
   * @param {String} req.params._id - meeting id
   */
  get: async( req, res ) => {
    const { _id }  = req.params;

    const meeting = await authUtils.checkParticipant( _id, req.credentials );

    res.status( 200 ).send( meeting );
  },

  /**
   * Create a new meeting
   * @param {String} req.body.name - meeting name
   * @param {Date}   req.body.date - meeting date
   */
  create: async( req, res ) => {
    const { name, date } = req.body;

    authUtils.checkUser( req.credentials );

    const meeting = await Meeting.create({
      name,
      date,
      owner_id: req.credentials.sub
    });

    res.status( 200 ).send( meeting );
  },

  /**
   * Update an existing meeting
   * @param {String} req.body.name  - meeting name
   * @param {Date}   req.body.date  - meeting date
   * @param {String} req.params._id - meeting id
   */
  update: async( req, res ) => {
    const { name, date } = req.body;
    const _id            = req.params._id;

    await authUtils.checkOwner( _id, 'meetings', req.credentials );

    const updated = await Meeting.findOneAndUpdate(
      { _id },
      { name, date },
      { new: true }
    );

    res.status( 200 ).send( updated );
  },

  /**
   * Get all related meeting data (topics, participants)
   * @param {string} req.params._id - meeting _id
   */
  aggregate: async( req, res ) => {
    const { _id }    = req.params;

    await authUtils.checkParticipant( _id, req.credentials );

    const [ meeting ] = await Meeting.aggregate([
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

    return res.status( 200 ).send( meeting );
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
      jobi.error( error.message );

      res.status( 500 ).send( error.message );
    } finally {
      session.endSession();
    }
  },

  async getTopics( req, res ) {
    const { _id }  = req.params;

    await authUtils.checkParticipant( _id, req.credentials );

    const topics = await Topic.find({ meeting_id: _id });

    return res.status( 200 ).send( topics );
  },

  async getParticipants( req, res ) {
    const { _id }  = req.params;

    await authUtils.checkParticipant( _id, req.credentials );

    const participants = await Participant.find({ meeting_id: _id });

    return res.status( 200 ).send( participants );
  }

};
