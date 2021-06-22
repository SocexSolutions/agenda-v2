const Crypto = require( "crypto" );

module.exports = {
  /**
	 * Validate a password by creating generating a new hash with the input
	 * password and the salt from the db then comparing this new hash with
	 * the hash in the db
	 *
	 * @param {*} password - users password from login form
	 * @param {*} hash - users hash in db
	 * @param {*} salt - hash from db
	 * @return {boolean} - validation was succesful
	 */
  validatePassword( password, hash, salt ) {
    // generate hash with given login password and salt
    const reqHash = crypto.pbkdf2Sync(
      password,
      salt,
      10000,
      64,
      "sha512"
    ).toString( "hex" );

    return reqHash === hash;
  },

  /**
	 * Generate a password salt and hash
	 *
	 * @param {String} password - users new password
	 * @return {Object} - object containing salt and hash
	*/
  genPassword( password ) {
    // create salt (random information)
    const salt = Crypto.randomBytes( 32 ).toString( "hex" );

    // generate hash with new password and salt
    const hash = Crypto.pbkdf2Sync(
      password,
      salt,
      10000,
      64,
      "sha512"
    ).toString( "hex" );

    return {
      salt,
      hash
    };
  }
};