const log      = require('@starryinternet/jobi');
const Ui       = require('../models/ui');

module.exports = {
  get: async( req, res ) => {
    try {
      const { user_id } = req.params;
      const ui = await Ui.findOne({ user_id });

      res.status( 200 ).send( ui );
    } catch ( err ) {
      log.error( 'Error fetching ui: ' + err.message );
    }
  },

  save: async( req, res ) => {
    try {
      const theme = req.body.theme;
      const user_id = req.body.user_id;

      const ui = await Ui.findOneAndUpdate(
        { user_id },
        { theme, user_id },
        {
          upsert: true,
          new: true
        }
      );

      res.status( 201 ).send( ui );
    } catch ( err ) {
      log.error( 'Error creating ui: ' + err.message );
    }
  }
};
