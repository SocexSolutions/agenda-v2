const Meeting = require( "../models/meeting" );
const ObjectID = require( "mongoose" ).Types.ObjectId;

module.exports = {
  index: async( req, res ) => {
    try {
      const meetings = await Meeting.find({});

      res.status( 200 ).send( meetings );
    } catch ( error ) {
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
      ] );

      res.status( 200 ).send( meeting );
    } catch ( error ) {
      res.status( 500 ).send( error.message );
    }
  },

  create: async( req, res ) => {
    const { owner_id, date } = req.body;

    try {
      const meeting = await Meeting.create({ owner_id, date });

      res.status( 201 ).send( meeting );
    } catch ( error ) {
      res.status( 500 ).send( error.message );
    }
  },
};
