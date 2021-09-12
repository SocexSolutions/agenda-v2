const assert  = require( "assert" );
const dbUtils = require( "../../utils/db" );
const db      = require( "../../../lib/db" );
const api     = require( "../../utils/api" );
const axios   = require( "axios" );

const user = {
  username: "thudson",
  password: "thudson",
  email:    "email"
};


describe( "controllers/user.js", function() {

  before( async() => {
    await api.start();
    await db.connect();
  });

  beforeEach( async() => {
    await dbUtils.clean();
  });

  after( async() => {
    await api.stop();
    await db.disconnect();
  });

  describe( "#register", () => {

    const path = "http://localhost:5000/user/register";

    it( "should register successfully when given valid creds", async() => {
      const res = await axios.post( path, user );

      assert( res.status === 201 );
    });

    it( "should not register user with invalid email", async() => {
      const invalidUser = {
        ...user,
        email: ""
      };

      try {
        await axios.post( path, invalidUser );

        throw new Error( "accepted user with invalid email" );

      } catch ( err ) {

        assert( true );
      }
    });

    it( "should not register user with invalid username", async() => {
      const invalidUser = {
        ...user,
        username: ""
      };

      try {
        await axios.post( path, invalidUser );

        throw new Error( "accepted user with invalid username" );

      } catch ( err ) {

        assert( true );
      }
    });

    it( "should not register user with invalid password", async() => {
      const invalidUser = {
        ...user,
        password: ""
      };

      try {
        await axios.post( path, invalidUser );

        throw new Error( "accepted user with invalid password" );

      } catch ( err ) {

        assert( true );
      }
    });

  });

  describe( "#login", () => {

    const path = "http://localhost:5000/user/login";

    const loginCreds = {
      username: user.username,
      password: user.password
    };

    beforeEach( async() => {
      await axios.post(
        "http://localhost:5000/user/register",
        user
      );
    });

    it( "should login successfully when given valid creds", async() => {
      const res = await axios.post( path, loginCreds );

      assert( res.status === 200 );
    });

    it( "should not login user with invalid password", async() => {
      const invalidUser = {
        ...loginCreds,
        password: "bacon"
      };

      try {
        await axios.post( path, invalidUser );

        throw new Error( "authenticated user with invalid password" );

      } catch ( err ) {

        assert( true );
      }
    });

    it( "should not login user with invalid username", async() => {
      const invalidUser = {
        ...loginCreds,
        username: "bacon"
      };

      try {
        await axios.post( path, invalidUser );

        throw new Error( "authenticated user with invalid username" );

      } catch ( err ) {

        assert( true );
      }
    });

  });

});
