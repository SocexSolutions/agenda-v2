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

    await mongoose.connect( dbConStr, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });

    console.log( "database connected" );

  } catch ( error ) {

    console.error( "database connection failed: " + error.message );
  }
};

db.disconnect = async() => {
  try {
    await mongoose.disconnect();

  } catch ( err ) {

    console.error( err );
  }
};

module.exports = db;
