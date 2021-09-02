const assert = require( "assert" );
const api    = require( "../../utils/api" );
const axios  = require( "axios" );

describe( "controllers/health.js", function() {
  const path = "http://localhost:5000/health";

  before( async() => {
    await api.start();
  });

  after( async() => {
    await api.stop();
  });

  it( "should respond with OK", async() => {
    const res = await axios.get( path );

    assert( res.data === "OK" );
  });

});