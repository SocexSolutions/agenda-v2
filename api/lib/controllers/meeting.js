const mongoose    = require('mongoose');
const Meeting     = require('../models/meeting');
const Topic       = require('../models/topic.js');
const Participant = require('../models/participant');
const User        = require('../models/user');
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

    await authUtils.checkUser( req.credentials );

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

    const [ agg ] = await Meeting.aggregate([
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

    const { _id: agg_id, name, date, owner_id } = agg;

    return res.status( 200 ).send({
      meeting: { _id: agg_id, name, date, owner_id },
      participants: agg.participants,
      topics: agg.topics
    });
  },

  /**
   * Create or update a meeting and all its data
   * @param {Meeting} req.body.meeting - meeting
   * @param {Topic[]} req.body.topics - array of Topics
   * @param {Participant[]} req.body.participants - array of Participants
   */
  aggregateSave: async( req, res ) => {
    let session;

    try {
      const { name, date, owner_id } = req.body.meeting;

      const meeting_id = req.body.meeting?._id || new ObjectID();
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
        meeting,
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
  },

  /**
   * Change a meeting's status potentially triggering lifecycle events
   * @param {string} req.body.status - new status
   * @param {Object} req.params._id - meeting id
   */
  async updateStatus( req, res ) {
    const { params: { _id }, body: { status } } = req;

    await authUtils.checkOwner( _id, 'meetings', req.credentials );

    const meeting = await Meeting.findOneAndUpdate(
      { _id },
      { status },
      { new: true }
    );

    // TODO send notification to participants when status changes from
    // draft to sent.

    return res.status( 200 ).send( meeting );
  },

  async getAllMeetings( req, res ) {
    const subject_email = req.credentials.user.email;
    const subject_id = req.credentials.sub;
    const { limit = 0, skip = 0 } = req.query; // Thanks tom

    try {
      const pipeline = [
        {
          $match: { _id: ObjectID( subject_id ) }
        },
        {
          $lookup: {
            from: 'meetings',
            localField: '_id',
            foreignField: 'owner_id',
            as: 'owned_meetings'
          }
        },
        {
          $lookup: {
            from: 'participants',
            pipeline: [
              { $match: { email: subject_email } },
              {
                $lookup: {
                  from: 'meetings',
                  localField: 'meeting_id',
                  foreignField: '_id',
                  as: 'meetings'
                }
              },
              {
                $project: {
                  meeting: { $arrayElemAt: [ '$meetings', 0 ] }
                }
              },
              {
                $replaceRoot: {
                  newRoot: '$meeting'
                }
              }
            ],
            as: 'participating_meetings'
          }
        },
        {
          $project: {
            meetings: {
              $concatArrays: [ '$participating_meetings', '$owned_meetings' ]
            }
          }
        },
        { $unwind: '$meetings' },
        { $sort: { 'meetings.createdAt': -1 } },
        { $skip: parseInt( skip ) },
        { $limit: parseInt( limit ) },
        {
          $group: {
            _id: '$_id',
            meetings: { $push: '$meetings' }
          }
        }
      ];

      const meetings = await User.aggregate( pipeline );

      return res.status( 200 ).send( meetings );
    } catch ( err ) {


      return res.status( 500 ).send( err );
    }
  }

};
