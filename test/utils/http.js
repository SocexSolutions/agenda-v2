const http = require( "http" );

module.exports = {
  /**
   * Makes a post request to the db with te given data and url path
   * @param {Object} data - request body in json
   * @param {String} path - url path in api
   * @returns {Promise} - requset response in json
   */
  async post( data, path ) {
    const base64Encoded = new TextEncoder().encode(
      JSON.stringify( data )
    );

    const options = {
      hostname: "localhost",
      port: 5000,
      path,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": base64Encoded.length
      }
    };

    const res = await makeRequest( options, base64Encoded );

    return JSON.parse( res );
  }
};

/**
 * Makes a request and returns a promise for the reponse
 * @param {Object} options - request options
 * @param {Buffer} data - base64 encoded data
 * @returns {Promise} promisified response
 */
function makeRequest( options, data ) {
  const responsePromise = new Promise( ( resolve, reject ) => {
    let payload = "";

    const req = http.request( options, ( res ) => {
      res.setEncoding( "utf8" );

      res.on( "data", ( chunk ) => {
        payload = payload + chunk;
      });

      res.on( "end", () => {
        resolve( payload );
      });

      res.on( "error", ( error ) => {
        reject( error );
      });
    });

    req.write( data );

    req.end();
  });

  return responsePromise;
}

