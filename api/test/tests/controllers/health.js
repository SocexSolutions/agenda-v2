const assert = require('assert');
const api    = require('../../utils/api');
const client = require('../../utils/client');

describe( 'lib/controllers/health.js', () => {
  const path = '/health';

  before( async() => {
    await api.start();
  });

  after( async() => {
    await api.stop();
  });

  it( 'should respond with OK', async() => {
    const res = await client.get( path );

    assert( res.data === 'OK' );
  });

});
