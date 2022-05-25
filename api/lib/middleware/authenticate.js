const JWTUtils = require('../auth/jwt');
const fs       = require('fs');
const path     = require('path');
const jobi     = require('@starryinternet/jobi');
const User     = require('../models/user');

const pathToKey = path.join( __dirname, '../../keys/id_rsa_pub.pem' );
const PUB_KEY   = fs.readFileSync( pathToKey, 'utf8' );

const authenticate = async( req, res, next ) => {
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

    const { email } = await User.findOne({ _id: decoded.sub });

    req.credentials = { ...decoded, email };

    next();

  } catch ( err ) {
    jobi.error( err );

    res.status( 401 ).json({ success: false, msg: 'Forbidden' });
  }
};

module.exports = authenticate;
