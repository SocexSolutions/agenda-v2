const assert  = require( "assert" );
const http    = require( "../../utils/http" );

describe( "health.js", function() {

  it( "should respond with ok", async() => {
    const path = "/health";

    const res = await http.get( path );

    assert( res === "OK" );
  });

});