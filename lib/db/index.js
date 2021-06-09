const mongoose = require( "mongoose" );

mongoose.connect( "mongodb://host.docker.internal:27017/agenda", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} );

const db = mongoose.connection;

db.on( "error", console.error.bind( console, "connection error" ) );

db.on( "open", () => {
  console.log( "connected" );
} );

mongoose.set( "useCreateIndex", true );

module.exports = db;