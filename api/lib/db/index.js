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