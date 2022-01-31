const jobi     = require('@starryinternet/jobi');
const mongoose = require('mongoose');

const db  = {};

db.connect = async() => {
  try {
    // because docker compose create a docker network, we use this internal
    // network by default, but for local dev we use localhost instead

    let dbConStr = 'mongodb://host.docker.internal:27017/agenda-dev';

    if ( process.env.NODE_ENV === 'test' ) {
      dbConStr = 'mongodb://localhost:27017/agenda-test';
    } else if ( process.env.NODE_ENV === 'dev' ) {
      dbConStr = 'mongodb://localhost:27017/agenda-dev';
    }

    jobi.info( 'using dbConStr ' + dbConStr );

    await mongoose.connect( dbConStr );

    jobi.info('database connected');

  } catch ( error ) {

    jobi.error( 'database connection failed: ' + error.message );
  }
};

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
