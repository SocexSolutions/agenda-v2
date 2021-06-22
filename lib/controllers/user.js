const User        = require( "../models/user" );
const { genPass } = require( "../utils/password" );

module.exports = {
  async register( req, res ) {
    // unpack from request by variable names in form
    const { email, username, password } = req.body;

    // take password and create salted hash
    const { hash, salt } = genPass( password );

    const newUser = {
      email,
      username,
      hash,
      salt
    };

    // attempt db insertion of user
    try {
      const res = await User.create( newUser );

			

    } catch ( err ) {
      console.error( err );
      res.status( 500 ).send( err );
    }
  }
};
