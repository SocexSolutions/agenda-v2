const JWTUtils = require('../utils/jwt');
const fs       = require('fs');
const path     = require('path');
const jobi     = require('@starryinternet/jobi');

const pathToKey = path.join( __dirname, '../../keys/id_rsa_pub.pem' );
const PUB_KEY   = fs.readFileSync( pathToKey, 'utf8' );

const authenticate = ( req, res, next ) => {
  jobi.trace('authenticating');

  try {
    const auth = req.headers.authorization;

    const decoded = JWTUtils.verifyJwt(
      auth,
      PUB_KEY,
      {
        algorithms: [ 'RS256' ]
      }
    );

    req.credentials = decoded;

    next();

  } catch ( err ) {
    jobi.error( err );

    res.status( 401 ).json({ success: false, msg: 'Forbidden' });
  }
};

module.exports = authenticate;
