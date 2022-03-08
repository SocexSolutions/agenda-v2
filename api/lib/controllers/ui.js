const log      = require('@starryinternet/jobi');
const Ui       = require('../models/ui');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports = {
  get: async( req, res ) => {
    try {
      const { user_id } = req.params;
      const ui = Ui.find({ user_id });

      res.status( 200 ).send( ui );
    } catch ( err ) {
      log.error( 'Error fetching ui: ' + err.message );
    }
  },

  save: async( req, res ) => {
    const theme = req.body.theme;
    const user_id = req.body.user_id;

    const theme_id = req.body.theme_id || new ObjectID();
    try {
      const ui = Ui.findOneAndUpdate(
        { _id: theme_id },
        { theme, user_id },
        {
          upsert: true,
          new: true
        }
      );

      console.log('test');
      res.status( 201 ).send( ui );
    } catch ( err ) {
      log.error( 'Error creating ui: ' + err.message );
    }
  }
};
