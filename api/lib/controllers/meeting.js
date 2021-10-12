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

  create: async( req, res ) => {
    let session;

    try {
      logger.log( "debug", "req.body: " + JSON.stringify( req.body ) );

      let { meeting, topics, participants } = req.body;

      session = await mongoose.connection.startSession();

      await session.withTransaction( async() => {
        const filter = meeting._id ? { _id: meeting._id } : {};

        const meetingRes = await Meeting.updateOne(
          filter,
          meeting,
          { upsert: true }
        );

        if ( meetingRes.upserted ) {
          const meeting_id = meetingRes.upserted[ 0 ]._id;
          meeting._id = meeting_id;
        }

        topics = topics.map( topic => {
          return { name: topic, meeting_id: meeting._id };
        });

        participants = participants.map( participant => {
          return { email: participant, meeting_id: meeting._id };
        });

        await Topic.deleteMany({ meeting_id: meeting._id });
        topics = await Topic.insertMany( topics );

        await Participant.deleteMany({ meeting_id: meeting._id });
        participants = await Participant.insertMany( participants );
      });

      logger.log( "debug", "meeting transaction completed" );

      res.status( 201 ).send({ meeting, topics, participants });

    } catch ( error ) {
      logger.log( "error", error.message );

      res.status( 500 ).send( error.message );
    } finally {
      session.endSession();
    }
  },

  update: async( req, res ) => {
    const { _id } = req.params;

    try {
      const meeting = await Meeting.findOneAndUpdate(
        { _id },
        req.body,
        {
          new: true, // specify to return updated doc instead of original
          useFindAndModify: false
        }
      );

      logger.log( "debug", "Updated: " + meeting );
      res.status( 200 ).send( meeting );

    } catch ( error ) {

      logger.log( "error", "Update Failed: " + error.message );
      res.status( 500 ).send( error.message );
    }
  },
};
