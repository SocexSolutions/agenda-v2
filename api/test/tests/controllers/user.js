const assert  = require( "assert" );
const dbUtils = require( "../../utils/db" );
const db      = require( "../../../lib/db" );
const api     = require( "../../utils/api" );
const client  = require( "../../utils/client" );

const user = {
  username: "thudson",
  password: "thudson",
  email:    "email"
};


describe( "controllers/user.js", function() {

  before( async() => {
    await api.start();
    await db.connect();
    await dbUtils.clean();
  });

  after( async() => {
    await api.stop();
    await db.disconnect();
  });

  afterEach( async() => {
    await dbUtils.clean();
  });

  describe( "#register", () => {

    const path = "/user/register";

    it( "should register successfully when given valid creds", async() => {
      const res = await client.post( path, user );

      assert( res.status === 201 );
    });

    it( "should not register user with invalid email", async() => {
      const invalidUser = {
        ...user,
        email: ""
      };

      let acceptedInvalidEmail = false;

      try {
        await client.post( path, invalidUser );
        acceptedInvalidEmail = true;
      } catch ( err ) {}

      assert( !acceptedInvalidEmail );
    });

    it( "should not register user with invalid username", async() => {
      const invalidUser = {
        ...user,
        username: ""
      };

      let acceptedInvalidUsername = false;

      try {
        await client.post( path, invalidUser );
        acceptedInvalidUsername = true;
      } catch ( err ) {}

      assert( !acceptedInvalidUsername );
    });

    it( "should not register user with invalid password", async() => {
      const invalidUser = {
        ...user,
        password: ""
      };

      let acceptedInvalidPassword = false;

      try {
        await client.post( path, invalidUser );
        acceptedInvalidPassword = true;
      } catch ( err ) {}

      assert( !acceptedInvalidPassword );
    });

  });

  describe( "#login", () => {

    const path = "/user/login";

    const loginCreds = {
      username: user.username,
      password: user.password
    };

    beforeEach( async() => {
      await client.post(
        "/user/register",
        user
      );
    });

    it( "should login successfully when given valid creds", async() => {
      const res = await client.post( path, loginCreds );

      assert( res.status === 200 );
    });

    it( "should not login user with invalid password", async() => {
      const invalidUser = {
        ...loginCreds,
        password: "bacon"
      };

      let acceptedInvalidPassword = false;

      try {
        await client.post( path, invalidUser );
        acceptedInvalidPassword = true;
      } catch ( err ) {}

      assert( !acceptedInvalidPassword );
    });

    it( "should not login user with invalid username", async() => {
      const invalidUser = {
        ...loginCreds,
        username: "bacon"
      };

      let acceptedInvalidUsername = false;

      try {
        await client.post( path, invalidUser );
      } catch ( err ) {}

      assert( !acceptedInvalidUsername );
    });

  });

});
