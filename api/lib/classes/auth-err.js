class AuthErr extends Error {

  /**
   * Create an authentication error (handled by error wrapper)
   *
   * @param {String} msg - error message
   * @param {Number} status - response status code
   */
  constructor( msg, status = 403 ) {
    super( msg );

    this.status = status;
  }
}

module.exports = AuthErr;
