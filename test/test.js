const assert  = require( "assert" );
const dbUtils = require( "./utils/db" );
const db      = require( "../lib/db" );
const http    = require( "./utils/http" );

describe( "Auth Test", function() {

  before( async() => {
    await db.connect();
  });

  beforeEach( async() => {
    await dbUtils.clean();
  });

  describe( "#indexof()", async() => {

    it( "should auth successfully when given valid creds", async() => {
      const path = "/user/register";
      const data = {
        username: "thudson",
        password: "thudson",
        email:    "email"
      };

      const res = await http.post( data, path );
      const parsed = JSON.parse( res );

      assert( parsed.success );
    });

    it( "should not auth with invalid creds", async() => {
      const path = "/user/register";
      const data = {
        password: "thudson",
        email: "email"
      };

      const res = await http.post( data, path );
      const parsed = JSON.parse( res );

      assert( parsed.success !== true );
    });

    it( "should respond with ok", async() => {
      const path = "/health";

      const res = await http.get( path );

      assert( res === "OK" );
    });

  });

});