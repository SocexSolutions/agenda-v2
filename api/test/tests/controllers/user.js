const dbUtils        = require('../../utils/db');
const db             = require('../../../lib/db');
const api            = require('../../utils/api');
const chai           = require('chai');
const chaiAsPromised = require('chai-as-promised');
const rewire         = require('rewire');

chai.use( chaiAsPromised );

const { assert } = chai;

const user = {
  username: 'thudson',
  password: 'thudson',
  email:    'email'
};

describe( 'lib/controllers/user.js', () => {

  before( async() => {
    // clear cache
    this.Client = rewire('../../utils/client');

    await api.start();
    await db.connect();
    await dbUtils.clean();
  });

  beforeEach( async() => {
    await dbUtils.clean();
  });

  after( async() => {
    await api.stop();
    await db.disconnect();
  });

  describe( '#register', () => {

    const path = '/user/register';

    it( 'should register successfully when given valid creds', async() => {
      const res = await this.Client.post( path, user );
      assert( res.status === 201 );
    });

    it( 'should register return user info', async() => {
      const res = await this.Client.post( path, user );

      assert.strictEqual( res.data.user.email, 'email' );
      assert.strictEqual( res.data.user.username, 'thudson' );
    });

    it( 'should not register a user with an existing username', async() => {
      await this.Client.post( path, user );

      return assert.isRejected( this.Client.post( path, user ) );
    });

    it( 'should register return an auth token', async() => {
      const res = await this.Client.post( path, user );

      const tokenRegex = new RegExp( /^Bearer\s/ );

      assert( tokenRegex.test( res.data.token ) );
    });

    it( 'should not register user with invalid email', async() => {
      const invalidUser = {
        ...user,
        email: ''
      };

      return assert.isRejected( this.Client.post( path, invalidUser ) );
    });

    it( 'should not register user with invalid username', async() => {
      const invalidUser = {
        ...user,
        username: ''
      };

      return assert.isRejected( this.Client.post( path, invalidUser ) );
    });

    it( 'should not register user with invalid password', async() => {
      const invalidUser = {
        ...user,
        password: ''
      };

      return assert.isRejected( this.Client.post( path, invalidUser ) );
    });

  });

  describe( '#login', () => {

    const path = '/user/login';

    const loginCreds = {
      username: user.username,
      password: user.password
    };

    beforeEach( async() => {
      await this.Client.post(
        '/user/register',
        user
      );
    });

    it( 'should login successfully when given valid creds', async() => {
      const res = await this.Client.post( path, loginCreds );

      assert( res.status === 200 );
    });

    it( 'should not login user with invalid password', async() => {
      const invalidUser = {
        ...loginCreds,
        password: 'bacon'
      };

      return assert.isRejected( this.Client.post( path, invalidUser ) );
    });

    it( 'should not login user with invalid username', async() => {
      const invalidUser = {
        ...loginCreds,
        username: 'bacon'
      };

      return assert.isRejected( this.Client.post( path, invalidUser ) );
    });

  });

  describe( '#refresh', () => {

    const path = '/user/refresh';

    let token;
    let user_id;

    beforeEach( async() => {
      const { data } = await this.Client.post(
        '/user/register',
        user
      );

      token = data.token;
      user_id = data.user._id;
    });

    it( 'should refresh a user info based on token', async() => {
      const options = { headers: { authorization: token } };

      const { data } = await this.Client.get( path, options );

      assert.deepInclude( data, {
        success: true,
        user: {
          _id: user_id,
          email: 'email',
          username: 'thudson'
        }
      });
    });

    it( 'should reject invalid auth token', async() => {
      const options = { headers: { authorization: 'token' } };

      return assert.isRejected( this.Client.get( path, options ) );
    });

  });

});
