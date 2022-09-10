const jobi     = require('@starryinternet/jobi');
const mongoose = require('mongoose');

const db  = {};

/* istanbul ignore next */
db.connect = async() => {
  try {
    // because docker compose creates a docker network, we use this internal
    // network by default, but for local dev we use localhost instead

    let dbConStr = process.env.DB_CONNECTION;

    if ( !dbConStr ) {
      const env  = process.env.NODE_ENV;
      const host = 'mongodb://localhost:27017';
      const db   = `agenda-${ env }`;

      dbConStr = `${ host }/${ db }`;
    }

    jobi.info( 'using dbConStr ' + dbConStr );

    await mongoose.connect( dbConStr );

    jobi.info('database connected');

  } catch ( error ) {

    jobi.error( 'database connection failed: ' + error.message );
  }
};

/* istanbul ignore next */
db.disconnect = async() => {
  jobi.info('disconnecting database');

  try {
    await mongoose.disconnect();

  } catch ( err ) {

    console.error( err );
  }

  jobi.info('database disconnected');
};

module.exports = db;
