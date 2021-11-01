const logger = require( "@starryinternet/jobi" );
const Topic  = require( "../models/topic" );

module.exports = {
  create: async( req, res ) => {
    logger.debug( "Creating topic with:  " + JSON.stringify( req.body ) );
    const { name, meeting_id, likes } = req.body;

    try {
      const topic = await Topic.create({ name, meeting_id, likes });

      logger.debug( "Topic created: " + JSON.stringify( topic ) );
      res.status( 201 ).send( topic );
    } catch ( error ) {

      logger.error( "Error creating topic: " + error.message );
      res.status( 500 ).send( error.message );
    }
  },
};
