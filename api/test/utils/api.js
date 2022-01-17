const express   = require('express');
const apiRouter = require('../../lib/routes');

const app = express();

let server;

const api = {

  /**
   * Start a new server, (defaults to full api if no params)
   *
   * @param {string} [urlPath] - url path to for express to use as base
   * @param {Router} [router] - express router instance to use
   *
   * @returns {Promise<undefined>}
   */
  start: async( urlPath, router ) => {
    try {
      app.use( express.json() );
      app.use( express.urlencoded({ extended: true }) );

      const basePath = urlPath || '/';
      const baseRouter  = router || apiRouter;

      app.use( basePath, baseRouter );

      const port = process.env.PORT || 5000;

      server = app.listen( port );
    } catch ( error ) {
      console.error( 'agenda api failed to start: ' + error.message );
    }
  },

  /**
   * Stop a server
   *
   * @returns {Promise<undefined>}
   */
  stop: async() => {
    try {
      server.close();
    } catch ( error ) {
      console.error( 'agenda api failed to stop: ' + error.message );
    }
  }
};

module.exports = api;
