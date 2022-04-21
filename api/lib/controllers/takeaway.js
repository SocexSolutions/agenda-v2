const Takeaway = require('../models/takeaway');

module.exports = {
  create: async( req, res ) => {
    try {
      const { content, topic_id } = req.body;
      const owner_id = req.credentials.sub;

      const takeaway = await Takeaway.create({
        content,
        topic_id,
        owner_id
      });

      res.status( 201 ).send( takeaway );
    } catch ( err ) {
      res.status( 500 ).send( err );
    }
  },

  delete: async( req, res ) => {
    try {
      const res2 = await Takeaway.deleteOne({
        _id: req.params.id
      });

      res.status( 200 ).send( res2 );
    } catch ( err ) {
      console.log( err );
      res.status( 500 ).send( err );
    }
  }
};
