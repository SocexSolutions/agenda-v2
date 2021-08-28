const express  = require( "express" );
const router   = require( "../../lib/routes" );

const app      = express();

let server;

const api = {
  start: async() => {
    try {
      app.use( express.json() );
      app.use( express.urlencoded({ extended: true }) );

      app.use( "/", router );

      const port = process.env.PORT || 5000;

      server = app.listen( port );

    } catch ( error ) {

      console.error( "agenda api failed to start: " + error.message );
    }
  },

  stop: async() => {
    try {
      server.close();

    } catch ( error ) {

      console.error( "agenda api failed to stop: " + error.message );
    }
  }
};

module.exports = api;
