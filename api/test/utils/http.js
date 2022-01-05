const http = require('http');

const hostname = 'localhost';
const port     = 4000;


module.exports = {
  /**
   * Makes a get request to the db with given path
   * @param {String} path - url path
   * @returns {Promise} - request response in json
   */
  async get( path ) {
    const options = {
      hostname,
      port,
      path,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    return await makeRequest( options );
  },

  /**
   * Makes a post request to the db with te given data and url path
   * @param {Object} data - request body in json
   * @param {String} path - url path in api
   * @returns {Promise} - request response in json
   */
  async post( data, path ) {
    const base64Encoded = new TextEncoder().encode(
      JSON.stringify( data )
    );

    const options = {
      hostname,
      port,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': base64Encoded.length
      }
    };

    return await makeRequest( options, base64Encoded );
  }
};

/**
 * Makes a request and returns a promise for the reponse
 * @param {Object} options - request options
 * @param {Buffer} data - base64 encoded data
 * @returns {Promise} promisified response
 */
function makeRequest( options, data ) {
  return new Promise( ( resolve, reject ) => {
    let payload = '';

    const req = http.request( options, ( res ) => {
      res.setEncoding('utf8');

      res.on( 'data', ( chunk ) => {
        payload = payload + chunk;
      });

      res.on( 'end', () => {
        resolve( payload );
      });

      res.on( 'error', ( error ) => {
        reject( error );
      });
    });

    if ( data ) {
      req.write( data );
    }

    req.end();
  });
}
