const mongoose = require( "mongoose" );

let db = {};

db.connect = async() => {
  try {
    let dbConStr = "mongodb://host.docker.internal:27017/";

    if ( process.env.NODE_ENV === "test" ) {
      dbConStr = dbConStr + "agenda";
    } else {
      dbConStr = dbConStr + "agenda-test";
    }

    await mongoose.connect( dbConStr, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });

    db = mongoose.connection;

    console.log( "DATABASE CONNECTED" );

  } catch ( error ) {

    console.error( "DATABASE CONNECTION FAILED: " + error.message );
  }
};

module.exports = db;