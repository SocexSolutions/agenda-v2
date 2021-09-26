const Meeting = require( "../models/meeting" );
const ObjectID = require( "mongoose" ).Types.ObjectId;
const logger = require( "@starryinternet/jobi" );

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
    const { owner_id, date, name } = req.body;

    try {
      const meeting = await Meeting.create({ owner_id, date, name });

      logger.log( "debug", "Created: " + meeting );
      res.status( 201 ).send( meeting );

    } catch ( error ) {

      logger.log( "error", "Create Failed: " + error.message );
      res.status( 500 ).send( error.message );
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
