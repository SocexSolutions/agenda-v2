const Meeting = require( "../models/meeting" );

module.exports = {
  display: async( req, res ) => {
    const { _id } = req.body;

    try {
      const meeting = await Meeting.findById( _id );

      res.sendStatus( 200 ).send( meeting );
    } catch ( error ) {
      res.status( 500 ).send( error.message );
    }
  },

  create: async( req, res ) => {
    const { owner_id, date } = req.body;

    console.log( owner_id );

    try {
      await Meeting.create({ owner_id, date });
      res.sendStatus( 201 );
    } catch ( error ) {

      console.log( error.message );

      res.status( 500 ).send( error.message );
    }
  }
};
