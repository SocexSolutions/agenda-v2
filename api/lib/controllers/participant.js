const Participant = require( "../models/participant" );

module.exports = {
  create: async( req, res ) => {
    const { firstName, lastName, email, meeting_id } = req.body;

    try {
      await Participant.create({ firstName, lastName, email, meeting_id });

      res.sendStatus( 201 );

    } catch ( error ) {

      res.status( 500 ).send({
        success: false,
        error: error.message
      });
    }
  }
};
