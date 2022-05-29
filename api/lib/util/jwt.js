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
   * @param {Object} sub - user or participant doc from db
   * @param {boolean} usr - if they are a user (not participant)
   *
   * @return {Object} object containing new JWT (token) and expires date
   */
  issueJWT( sub, usr ) {
    const _id = sub._id;

    const expiresIn = '1d';

    const payload = {
      sub: _id, // sub property of jwt (subject) identified who it is for
      iat: Date.now(), // iat issued at identified when token was issued
      usr // whether this is for a user or participant
    };

    const signedToken = JsonWebToken.sign(
      payload,
      PRIV_KEY,
      { algorithm: 'RS256' }
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
   *
   * @param {String} authorization - request authorization header
   *
   * @returns decrypted jwt
   */
  verifyJWT( authorization ) {
    const [ bearer, token ] = authorization.split(' ');

    if ( !( bearer === 'Bearer' ) ) {
      throw new Error('unauthorized');
    }

    if ( !token.match( /\S*\.\S*\.\S*/ ) ) {
      throw new Error('unauthorized');
    }

    const decrypted = JsonWebToken.verify(
      token,
      PUB_KEY,
      { algorithms: [ 'RS256' ] }
    );

    const oneDayMs = 1e3 * 24 * 60 * 60;

    if ( ( decrypted.iat + oneDayMs ) <= Date.now() ) {
      throw new Error('unauthorized');
    }

    return decrypted;
  }
};
