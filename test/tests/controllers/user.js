const assert  = require( "assert" );
const http    = require( "../../utils/http" );
const dbUtils = require( "../../utils/db" );
const db      = require( "../../../lib/db" );

describe( "controllers/user.js", function() {

  before( async() => {
    await db.connect();
  });

  beforeEach( async() => {
    await dbUtils.clean();
  });

  after( async() => {
    await db.disconnect();
  });

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

});