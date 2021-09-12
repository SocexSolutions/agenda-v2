const Topic = require( "../models/topic" );

module.exports = {
  create: async( req, res ) => {
    const { name, meeting_id, likes } = req.body;

    try {
      const topic = await Topic.create({ name, meeting_id, likes });

      res.status( 201 ).send( topic );
    } catch ( error ) {
      res.status( 500 ).send( error.message );
    }
  },
};
