const assert = require( "assert" );
const api    = require( "../../utils/api" );
const client = require( "../../utils/client" );

describe( "controllers/health.js", function() {
  const path = "/health";

  before( async() => {
    await api.start();
  });

  after( async() => {
    await api.stop();
  });

  it( "should respond with OK", async() => {
    const res = await client.get( path );

    assert( res.data === "OK" );
  });

});
