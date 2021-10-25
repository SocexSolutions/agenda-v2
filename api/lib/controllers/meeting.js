const mongoose    = require( "mongoose" );
const Meeting     = require( "../models/meeting" );
const Topic       = require( "../models/topic" );
const Participant = require( "../models/participant" );
const ObjectID    = require( "mongoose" ).Types.ObjectId;
const logger      = require( "@starryinternet/jobi" );

module.exports = {
  index: async( req, res ) => {
    try {
      const meetings = await Meeting.find({});

      logger.log( "debug", "Response: " + meetings );
      res.status( 200 ).send( meetings );

    } catch ( error ) {

      logger.log( "error", "INDEX FAILED: " + error.message );
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
      const meeting = await Meeting.aggregate( [
        {
          $match: {
            _id: new ObjectID( _id ),
          },
        },
        {
          $lookup: {
            from: "participants",
            localField: "_id",
            foreignField: "meeting_id",
            as: "participants",
          },
        },
        {
          $lookup: {
            from: "topics",
            localField: "_id",
            foreignField: "meeting_id",
            as: "topics"
          }
        }
      ] );

      logger.log( "debug", "Found: " + meeting );
      res.status( 200 ).send( meeting );

    } catch ( error ) {

      logger.log( "error", error.message );
      res.status( 500 ).send( error.message );
    }
  },

  /**
   * Create or update a meeting
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
      logger.log( "debug", "req.body: " + JSON.stringify( req.body ) );

      const {
        name,
        date,
        owner_id
      } = req.body;

      let topics       = req.body.topics || null;
      let participants = req.body.participants || null;
      let meeting;


      session = await mongoose.connection.startSession();

      await session.withTransaction( async() => {

        meeting = await Meeting.create({
          name,
          date,
          owner_id
        });

        if ( topics ) {
          topics = topics.map( topic => {
            return { name: topic.name, meeting_id: meeting._id };
          });

          topics = await Topic.insertMany( topics );
        }

        if ( participants ) {
          participants = participants.map( participant => {
            return { email: participant.email, meeting_id: meeting._id };
          });

          participants = await Participant.insertMany( participants );
        }
      });

      logger.log( "debug", "meeting transaction completed" );

      res.status( 201 ).send({
        ...meeting,
        topics,
        participants
      });

    } catch ( error ) {
      logger.log( "error", error.message );

      console.log( error.message );

      res.status( 500 ).send( error.message );
    } finally {
      session.endSession();
    }
  },

};
