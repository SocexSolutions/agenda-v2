const Participant = require( "../models/participant" );

module.exports = {
  create: async( req, res ) => {
    const { email, meeting_id } = req.body;

    try {
      const participant = await Participant.create({
        email,
        meeting_id,
      });

      res.status( 201 ).send( participant );
    } catch ( error ) {
      res.status( 500 ).send( error );
    }
  },
};
