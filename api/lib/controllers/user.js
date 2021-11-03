const User      = require( "../models/user" );
const PassUtils = require( "../utils/password" );
const JWTUtils  = require( "../utils/jwt" );


module.exports = {
  async register( req, res ) {
    try {
      // unpack from request by variable names in form
      const { email, username, password } = req.body;

      // password is not stored in db and is thus not validated by the model so
      // we quality check it here.
      if ( !password ) {
        throw new Error( "Invalid Password" );
      }

      const { hash, salt } = PassUtils.genPassword( password );

      const newUser = {
        email,
        username,
        hash,
        salt
      };

      const user = await User.create( newUser );

      const { token, expiresIn } = JWTUtils.issueJWT( user );

      res.status( 201 ).json({
        success: true,
        user: {
          _id: user._id,
          email: user.email,
          username: user.username
        },
        token,
        expiresIn
      });

    } catch ( err ) {

      res.status( 500 ).send( err );
    }
  },

  async login( req, res ) {
    try {
      // unpack from request
      const { username, password } = req.body;

      // search for user
      const user = await User.findOne({ username });

      // if no user return
      if ( !user ) {
        return (
          res.status( 401 ).json({
            success: false,
            msg: "invalid username" // need to change for prod
          })
        );
      }

      // validate password
      const valid = PassUtils.validatePassword(
        password,
        user.hash,
        user.salt
      );

      // if valid return 200 and issue a jwt
      if ( valid ) {
        const { token, expiresIn } = JWTUtils.issueJWT( user );

        res.status( 200 ).json({
          success: true,
          user: {
            _id: user._id,
            email: user.email,
            username: user.username
          },
          token,
          expiresIn
        });
      } else {
        res.status( 401 ).json({
          success: false,
          msg: "invalid credentials"
        });
      }

    } catch ( err ) {

      res.status( 500 ).send( err );
    }
  },

  async refresh( req, res ) { // get route
    try {
      const token = req.headers.authorization;

      const decoded = JWTUtils.verifyJwt( token );

      const user = await User.findById( decoded.sub );

      res.status( 200 ).json({
        success: true,
        user: {
          _id: user._id,
          email: user.email,
          username: user.username
        }
      });
    } catch ( err ) {
      console.log( err );
    }
  },
};
