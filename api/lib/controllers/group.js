const Group  = require( "../models/group" );
const ObjectID = require( "mongoose" ).Types.ObjectId;

module.exports = {
  display: async( req, res ) => {
    const { _id } = req.params;

    try {
      const group = await Group.aggregate( [
        {
          $match: {
            _id: new ObjectID( _id )
          }
        },
        {
          $lookup: {
            from: "members",
            localField: "_id",
            foreignField: "group_id",
            as: "members"
          }
        }
      ] );

      res.status( 200 ).send( group );
    } catch ( error ) {
      res.status( 500 ).send( error.message );
    }
  },

  create: async( req, res ) => {
    const { owner_id } = req.body;

    try {
      const group = await Group.create({ owner_id });

      res.status( 201 ).send( group );
    } catch ( error ) {
      res.status( 500 ).send( error.message );
    }
  }
};
