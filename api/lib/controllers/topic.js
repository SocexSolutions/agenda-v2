const log   = require('@starryinternet/jobi');
const Topic = require('../models/topic');

module.exports = {
  create: async( req, res ) => {
    const { name, meeting_id, likes } = req.body;

    try {
      const topic = await Topic.create({ name, meeting_id, likes });

      res.status( 201 ).send( topic );
    } catch ( error ) {
      log.error( 'Error creating topic: ' + error.message );
      res.status( 500 ).send( error.message );
    }
  },

  like: async( request, response ) => {
    const { _id } = request.params;
    const { email } = request.body;

    try {
      const topic = await Topic.findOne({ _id });

      //like and unlike
      if ( !topic.likes.includes( email ) ) {
        topic.likes.push( email );
      } else {
        topic.likes = topic.likes.filter( email => {
          return email !== email;
        });
      }

      //update topic in db
      const res = await Topic.findOneAndUpdate(
        { _id },
        { likes: topic.likes },
        { new: true }
      );

      response.status( 200 ).send( res );

    } catch ( error ) {
      response.status( 500 ).send( error );
    }
  }
};
