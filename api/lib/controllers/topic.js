const log      = require('@starryinternet/jobi');
const Topic    = require('../models/topic');
const Takeaway = require('../models/takeaway');

module.exports = {
  create: async( req, res ) => {
    const newTopic = req.body;
    const { user } = req.credentials;

    try {
      const topic = await Topic.create({ ...newTopic, owner_id: user._id });

      res.status( 201 ).send( topic );
    } catch ( error ) {
      log.error( 'Error creating topic: ' + error.message );
      res.status( 500 ).send( error.message );
    }
  },

  update: async( request, response ) => {
    const updates = request.body;
    const { _id } = request.params;

    const sub_id = request.credentials.sub;

    try {
      const topic = await Topic.findOne({ _id });

      if ( sub_id !== topic.owner_id.toString() ) {
        return response.status( 403 ).send('unauthorized');
      }

      const topicUpdated = await Topic.findOneAndUpdate(
        { _id },
        { ...updates, owner_id: sub_id },
        { new: true }
      );

      response.status( 200 ).send( topicUpdated );

    } catch ( error ) {
      log.error( error );
      response.status( 500 ).send( error.message );
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
  },

  status: async( request, response ) => {
    try {
      const { _id }    = request.params;
      const { status } = request.body;

      const res = await Topic.findOneAndUpdate(
        { _id },
        { status },
        { new: true }
      );

      response.status( 200 ).send( res );
    } catch ( err ) {
      response.status( 500 ).send( err );
    }
  },

  getTakeaways: async( req, res ) => {
    try {
      const  topic_id = req.params.id;

      const takeaways = await Takeaway.find({ topic_id });

      res.status( 200 ).send( takeaways );
    } catch ( err ) {
      log.error( err );
      res.status( 500 ).send( err );
    }
  }
};
