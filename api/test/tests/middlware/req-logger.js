const sinon  = require('sinon');
const rewire = require('rewire');

const modulePath = '../../../lib/middleware/req-logger';

describe( 'lib/middleware/req-logger', () => {

  before( () => {
    this.module = rewire( modulePath );
  });

  it( 'should call next() regardless of failure', () => {
    const next = sinon.stub().resolves();
    const log  = sinon.stub().throws( new Error('error') );

    this.module.__set__({ log });

    this.module( {}, {}, next );

    sinon.assert.calledOnce( next );
  });

});
