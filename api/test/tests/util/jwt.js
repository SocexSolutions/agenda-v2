const libRewire    = require('../../utils/lib-rewire');
const JsonWebToken = require('jsonwebtoken');
const fs           = require('fs');
const fakeUser     = require('../../fakes/user');
const ObjectId     = require('mongoose').Types.ObjectId;
const { assert }   = require('chai');

const pathToPrivKey = process.cwd() + '/keys/id_rsa_priv.pem';
const pathToPubKey  = process.cwd() + '/keys/id_rsa_pub.pem';

const PRIV_KEY = fs.readFileSync( pathToPrivKey, 'utf8' );
const PUB_KEY  = fs.readFileSync( pathToPubKey, 'utf8' );

const modulePath = 'lib/util/jwt';

describe( modulePath, () => {

  beforeEach( () => {
    this.module = libRewire( modulePath );
    this.user = fakeUser({ _id: new ObjectId });
  });

  describe( '#issueJWT', () => {

    it( 'should create a valid jwt', () => {
      const { token: auth } = this.module.issueJWT( this.user, true );

      const token = auth.split(' ').pop();

      JsonWebToken.verify(
        token,
        PUB_KEY,
        { algorithms: [ 'RS256' ] }
      );
    });

    it( 'should set usr claim to true if user', () => {
      const { token: auth } = this.module.issueJWT( this.user, true );

      const token = auth.split(' ').pop();

      const decrypted = JsonWebToken.verify(
        token,
        PUB_KEY,
        { algorithms: [ 'RS256' ] }
      );

      assert.isTrue( decrypted.usr );
    });

    it( 'should set usr claim to false if participant', () => {
      const { token: auth } = this.module.issueJWT( this.user, false );

      const token = auth.split(' ').pop();

      const decrypted = JsonWebToken.verify(
        token,
        PUB_KEY,
        { algorithms: [ 'RS256' ] }
      );

      assert.isFalse( decrypted.usr );
    });

  });

  describe( '#verifyJWT', () => {

    it( 'should decrypt a valid jwt', () => {
      const token = JsonWebToken.sign(
        {
          sub: 'sub_id',
          iat: Date.now()
        },
        PRIV_KEY,
        { algorithm: 'RS256' }
      );

      const auth = 'Bearer ' + token;

      const decrypted = this.module.verifyJWT( auth );

      assert.equal( decrypted.sub, 'sub_id' );
    });

    it( 'should reject if wrong auth scheme', () => {
      const token = JsonWebToken.sign(
        {
          sub: 'sub_id',
          iat: Date.now()
        },
        PRIV_KEY,
        { algorithm: 'RS256' }
      );

      const auth = 'Basic ' + token;

      assert.throws( () => this.module.verifyJWT( auth ) );
    });

    it( 'should reject if invalid token format', () => {
      const token = 'a.a';
      const auth  = 'Bearer ' + token;

      assert.throws( () => this.module.verifyJWT( auth ) );
    });

    it( 'should reject if token is more then one day old', () => {
      const token = JsonWebToken.sign(
        {
          sub: 'sub_id',
          iat: Date.now() - 1e3 * 25 * 60 * 60
        },
        PRIV_KEY,
        { algorithm: 'RS256' }
      );

      const auth = 'Bearer ' + token;

      assert.throws( () => this.module.verifyJWT( auth ) );
    });

  });

});
