const mongoose = require( "mongoose" );

let dbString = "mongodb://host.docker.internal:27017/";

if ( process.env.NODE_ENV === 'test' ) {
	dbString = dbString + 'agenda';
} else {
	dbString = dbString + 'agenda-test';
}

mongoose.connect( dbString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
} );

const db = mongoose.connection;

db.on( "error", console.error.bind( console, "connection error" ) );

db.on( "open", () => {
  console.log( "connected" );
} );

mongoose.set( "useCreateIndex", true );

module.exports = db;