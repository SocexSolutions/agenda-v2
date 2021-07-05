const assert  = require( "assert" );
const dbUtils = require( "./utils/db" );
const db      = require( "../lib/db" );

/**
 * TODO modify the db con so that it can be awaited.
 * This will require a change to the app.js file as we will want to await the 
 * db connection instead of just starting the connection before the app is 
 * setup.
 */

describe( "First Test", function() {

	beforeEach( async () => {
		await dbUtils.clean();

		console.log( 'cleaned db' );
	});

  describe( "#indexof()", function() {

    it( "should return -1 when the value is not present", function() {

      assert.equal( [ 1, 2, 3 ].indexOf( 4 ), -1 );

    });

  });

});