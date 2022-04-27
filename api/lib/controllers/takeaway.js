const log      = require('@starryinternet/jobi');
const Takeaway = require('../models/takeaway');

module.exports = {
  create: async( req, res ) => {
    console.log('is this working');
    try {
      const { name, description, topic_id } = req.body;
      const subject_id = req.credentials.sub;

      const takeaway = await Takeaway.create({
        name,
        description,
        topic_id,
        owner_id: subject_id
      });

      res.status( 201 ).send( takeaway );
    } catch ( err ) {
      log.error( err );
      res.status( 500 ).send( err );
    }
  },

  update: async( req, res ) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const subject_id = req.credentials.sub;

      const takeaway = await Takeaway.findOne({ _id: id });

      if ( subject_id !== takeaway.owner_id.toString() ) {
        return res.status( 403 ).send('unauthorized');
      }

      const updatedTakeaway = await Takeaway.findOneAndUpdate(
        { _id: id },
        { name, owner_id: subject_id, description  },
        { new: true }
      );

      res.status( 200 ).send( updatedTakeaway );
    } catch ( err ) {
      log.error( err );
      res.status( 500 ).send( err );
    }
  },

  delete: async( req, res ) => {
    try {
      const { id } = req.params;
      const subject_id = req.credentials.sub;

      const takeaway = await Takeaway.findOne({ _id: id });

      if ( subject_id !== takeaway.owner_id.toString() ) {
        return res.status( 403 ).send('unauthorized');
      }

      const deleted = await Takeaway.deleteOne({
        _id: id
      });

      res.status( 200 ).send( deleted );
    } catch ( err ) {
      log.error( err );
      res.status( 500 ).send( err );
    }
  }
};
