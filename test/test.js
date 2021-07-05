const assert  = require( "assert" );
const http    = require( "http" );
const dbUtils = require( "./utils/db" );
const db      = require( "../lib/db" );

describe( "First Test", function() {

	before( async( ) => {
		await db.connect();
	});

	beforeEach( async( ) => {
		await dbUtils.clean();
	});

  describe( "#indexof()", function( ) {

    it( "should return -1 when the value is not present", async( ) => {

			const options = {
				hostname: 'localhost',
				port: '5000',
				path: '/user/register',
				method: 'POST',
			}

			const req = http.request( options, ( res ) => {
				console.log( `STATUS: ${ res.statusCode }` );

				throw new Error( res );
			} );

		
    });

  });

});