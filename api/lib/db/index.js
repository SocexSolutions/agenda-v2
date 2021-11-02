const logger   = require( "@starryinternet/jobi" );
const mongoose = require( "mongoose" );

let db  = {};

db.connect = async() => {
  try {
    let dbConStr = "mongodb://host.docker.internal:27017/agenda";

    if ( process.env.NODE_ENV === "test" ) {
      dbConStr = "mongodb://localhost:27017/agenda-test";
    } else if ( process.env.NODE_ENV === "dev" ) {
      dbConStr = "mongodb://localhost:27017/agenda-dev";
    }

    logger.info( "using dbConStr " + dbConStr );

    await mongoose.connect( dbConStr, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });

    logger.info( "database connected" );

  } catch ( error ) {

    logger.error( "database connection failed: " + error.message );
  }
};

db.disconnect = async() => {
  logger.info( "disconnecting database" );

  try {
    await mongoose.disconnect();

  } catch ( err ) {

    console.error( err );
  }

  logger.info( "database disconnected" );
};

module.exports = db;
