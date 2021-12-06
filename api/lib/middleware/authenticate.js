const jsonwebtoken = require('jsonwebtoken');
const fs           = require('fs');
const path         = require('path');
const jobi         = require('@starryinternet/jobi');

const pathToKey = path.join( __dirname, '../../keys/id_rsa_pub.pem' );
const PUB_KEY   = fs.readFileSync( pathToKey, 'utf8' );

const authenticate = ( req, res, next ) => {
  jobi.trace('authenticating');

  try {
    const [ bearer, token ] = req.headers.authorization.split(' ');

    if ( !bearer === 'Bearer' || !token.match( /\S*\.\S*\.\S*/ ) ) {
      return res.status( 401 ).json({ success: false, msg: 'Forbidden' });
    }

    req.jwt = jsonwebtoken.verify(
      token,
      PUB_KEY,
      {
        algorithms: [ 'RS256' ]
      }
    );

    next();

  } catch ( err ) {
    jobi.error( err );

    res.status( 401 ).json({ success: false, msg: 'Forbidden' });
  }
};

module.exports = authenticate;
