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

describe( "api/lib/controllers/user.js", () => {

  before( async() => {
    await api.start();
    await db.connect();
  });

  beforeEach( async() => {
    await dbUtils.clean();
  });

  after( async() => {
    await api.stop();
    await dbUtils.clean();
    await db.disconnect();
  });

  describe( "#register", () => {

    const path = "/user/register";

    it( "should register successfully when given valid creds", async() => {
      const res = await client.post( path, user );

      assert( res.status === 201 );
    });

    it( "should register return user info", async() => {
      const res = await client.post( path, user );

      assert.strictEqual( res.data.user.email, "email" );
      assert.strictEqual( res.data.user.username, "thudson" );
    });

    it( "should register return an auth token", async() => {
      const res = await client.post( path, user );

      // eslint-disable-next-line
      const tokenRegex = new RegExp(/^Bearer\s/);

      assert( tokenRegex.test( res.data.token ) );
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
