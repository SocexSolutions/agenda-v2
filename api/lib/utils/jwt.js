const JsonWebToken = require('jsonwebtoken');
const fs           = require('fs');
const path         = require('path');

const pathToPrivKey = path.join( __dirname, '../../keys/id_rsa_priv.pem' );
const pathToPubKey  = path.join( __dirname, '../../keys/id_rsa_pub.pem' );

const PRIV_KEY = fs.readFileSync( pathToPrivKey, 'utf8' );
const PUB_KEY  = fs.readFileSync( pathToPubKey, 'utf8' );

module.exports = {
  /**
	 * Create a JWT (json web token) for a successfully authenticated user
	 *
	 * @param {Object} user - user doc from db
	 * @return {Object} object containing new JWT (token) and expires date
	 */
  issueJWT( user ) {
    const _id = user._id;

    const expiresIn = '1d';

    const payload = {
      sub: _id, // sub property of jwt (subject) identified who it is for
      iat: Date.now() // iat issued at identified when token was issued
    };

    const signedToken = JsonWebToken.sign(
      payload,
      PRIV_KEY,
      { expiresIn, algorithm: 'RS256' }
    );

    // Bearer is the name of the JWT auth strategy
    return {
      token: 'Bearer ' + signedToken,
      expiresIn
    };
  },

  /**
   * Verify that an authorization header is JWT and is valid, will throw an
   * if invalid or expired token
   * @param {String} authorization - request authorization header
   * @returns decrypted jwt
   */
  verifyJwt( authorization ) {
    const [ bearer, token ] = authorization.split(' ');

    if ( !bearer === 'Bearer' || !token.match( /\S*\.\S*\.\S*/ ) ) {
      throw new Error('unauthorized');
    }

    const decoded = JsonWebToken.verify(
      token,
      PUB_KEY,
      { algorithms: [ 'RS256' ] }
    );

    if ( decoded.exp <= Date.now() ) {
      throw new Error('unauthorized');
    }

    return decoded;
  }
};
