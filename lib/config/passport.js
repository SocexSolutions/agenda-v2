const PassportJWT = require( "passport-jwt" );
const path        = require( "path" );
const fs          = require( "fs" );
const User        = require( "../models/user" );

const pathToKey = path.join( __dirname, "..", "id_rsa_pub.pem" );
const PUB_KEY   = fs.readFileSync( pathToKey, "utf8" );

// options for JWT setup
const options = {
  jwtFromRequest: PassportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: [ "RS256" ]
};

const strategy = new PassportJWT.Strategy( options, async( payload, done ) => {
  try {
    const user = await User.findById( payload.sub );

    if ( user ) {
      return done( null, user );
    } else {
      return done( null, false );
    }
  } catch ( err ) {
    console.error( err );
    return done( err, null );
  }
} );

module.exports = ( passport ) => {
  passport.use( strategy );
};