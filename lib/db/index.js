const mongoose = require( "mongoose" );

let db = {};

db.connect = async() => {
	try {
		let dbConStr = "mongodb://host.docker.internal:27017/";

		if ( process.env.NODE_ENV === 'test' ) {
			dbConStr = dbConStr + 'agenda';
		} else {
			dbConStr = dbConStr + 'agenda-test';
		}

		mongoose.connect( dbConStr, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true
		} );

		db = mongoose.connection;

		db.on( "error", () => {
			console.error.bind( console, "data" ) 
		});

		db.on( "open", () => {
			console.log( "DATABASE CONNECTED" );
		});
	
	} catch ( error ) {

		console.error( "DATABASE CONNECTION FAILED: " + error.message );
	}
}

module.exports = db;