const sinon      = require('sinon');
const { assert } = require('chai');
const router     = require('express').Router();
const api        = require('../../utils/api');
const lib_rewire = require('../../utils/lib-rewire');
const client     = require('../../utils/client');

const module_path = 'lib/middleware/req-logger';


describe( 'lib/middleware/req-logger', () => {

  beforeEach( () => {
    this.module = lib_rewire( module_path );
  });

  afterEach( () => {
    api.stop();
  });

  this.controller = ( req, res ) => {
    return res.status( 200 ).send('hello');
  };

  this.bindRoutesStartServer = ( urlPath, middleware, controller ) => {
    router.use( urlPath, middleware, controller );

    api.start( '/', router );
  };

  it( 'should call controller regardless of failure', async() => {
    const log = {
      info: sinon.stub()
    };

    const urlPath = '/test1';

    this.module.__set__({ log });

    this.bindRoutesStartServer( urlPath, this.module, this.controller );

    const res = await client.post( urlPath, { msg: 'hi' } );

    sinon.assert.calledOnce( log.info );

    assert.strictEqual( res.status, 200 );
    assert.strictEqual( res.data, 'hello' );
  });

  it( 'should log request and response', async() => {
    const log = {
      info: sinon.stub().returns(),
      debug: sinon.stub().returns(),
      trace: sinon.stub().returns()
    };

    const urlPath = '/test2';

    this.module.__set__({ log });

    this.bindRoutesStartServer( urlPath, this.module, this.controller );

    await client.post( urlPath, { msg: 'hi' } );

    sinon.assert.calledOnceWithExactly( log.info, '*' + urlPath );
    sinon.assert.calledThrice( log.debug );

    sinon.assert.calledWithExactly(
      log.debug.getCall( 0 ), 'request params: {}'
    );
    sinon.assert.calledWithExactly(
      log.debug.getCall( 1 ), 'request body: {"msg":"hi"}'
    );
    sinon.assert.calledWithExactly(
      log.debug.getCall( 2 ), 'response payload: "hello"'
    );
  });

});
