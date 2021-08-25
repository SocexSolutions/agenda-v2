const jsonwebtoken = require( "jsonwebtoken" );
const path         = require( "path" );
const fs           = require( "fs" );
const User         = require( "../models/user" );

const pathToKey = path.join( __dirname, "..", "id_rsa_pub.pem" );
const PUB_KEY   = fs.readFileSync( pathToKey, "utf8" );

const authenticate = ( req, res, next ) => {
  try {
    const [ bearer, token ] = req.headers.authorization.split( " " );

    if ( !bearer === "Bearer" || !token.match( /\S*\.\S*\.\S*/ ) ) {
      res.status( 401 ).json({ success: false, msg: "Forbidden" });
    }

    req.jwt = jsonwebtoken.verify(
      token,
      PUB_KEY,
      {
        algorithms: [ "RS256" ]
      }
    );

    console.log( req.jwt );

    next();

  } catch( err ) {
    console.error( err );

    res.status( 401 ).json({ success: false, msg: "Forbidden" });
  }
};

module.exports = authenticate;