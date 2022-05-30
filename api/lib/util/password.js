const crypto = require('crypto');

module.exports = {
  /**
   * Validate a password by creating generating a new hash with the input
   * password and the salt from the db then comparing this new hash with
   * the hash in the db
   *
   * @param {String} password - users password from login form
   * @param {String} hash - users hash in db
   * @param {String} salt - hash from db
   * @return {Boolean} - validation was succesful
   */
  validatePassword( password, hash, salt ) {
    // generate hash with given login password and salt
    const reqHash = crypto.pbkdf2Sync(
      password,
      salt,
      10000,
      64,
      'sha512'
    ).toString('hex');

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
    const salt = crypto.randomBytes( 32 ).toString('hex');

    // generate hash with new password and salt
    const hash = crypto.pbkdf2Sync(
      password,
      salt,
      10000,
      64,
      'sha512'
    ).toString('hex');

    return {
      salt,
      hash
    };
  }
};
