const User = require( "../models/user" );

module.exports = {
  create: ( req, res ) => {
    const { firstName, lastName, email } = req.body;

    try {
      User.create( { firstName, lastName, email } );
      res.sendStatus( 200 );
    } catch ( err ) {
      res.status( 500 ).send( "Something went wrong!" );
      console.error( "This be the err: ", err );
    }
  },
};
