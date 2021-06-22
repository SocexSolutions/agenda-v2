const JsonWebToken = require( "jsonwebtoken" );
const fs           = require( "fs" );
const path         = require( "path" );

const pathToKey = path.join( __dirname, "..", "id_rsa_priv.pem" );
const PRIV_KEY  = fs.readFileSync( pathToKey, "utf8" );

module.exports = {
  /**
	 * Create a JWT (json web token) for a succesfully authenticated user
	 *
	 * @param {Object} user - user doc from db
	 * @return {Object} object containing new JWT (token) and expires date
	 */
  issueJWT( user ) {
    const _id = user._id;

    const expiresIn = "1d";

    const payload = {
      sub: _id, // sub property of jwt (subject) identified who it is for
      iat: Date.now() // iat issued at identified when token was issued
    };

    // sign web token (encrypt payload with private key)
    const signedToken = JsonWebToken.sign(
      payload,
      PRIV_KEY,
      {
        expiresIn,
        algorithm: "RS256"
      }
    );

    // Bearer is the name of the JWT auth strategy
    return {
      token: "Bearer " + signedToken,
      expiresIn
    };
  }
};