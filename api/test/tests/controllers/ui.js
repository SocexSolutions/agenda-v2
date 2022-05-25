const { assert } = require('chai');
const dbUtils    = require('../../utils/db');
const db         = require('../../../lib/db');
const api        = require('../../utils/api');
const client     = require('../../utils/client');
const themeFaker = require('../../fakes/theme');
const Ui         = require('../../../lib/models/ui');

describe( 'controllers/ui', () => {

  let user_id;
  const path = '/ui';

  before( async() => {
    await api.start();
    await db.connect();
    await dbUtils.clean();

    const res = await client.post(
      '/user/register',
      { username: 'user', password: 'pass', email: 'email' }
    );

    user_id = res.data.user._id;

    client.defaults.headers.common['Authorization'] = res.data.token;
  });

  beforeEach( async() => {
    await dbUtils.clean([ 'uis' ]);

    const themes = Array.from( { length: 5 }, () => {
      return themeFaker();
    });

    await Ui.insertMany( themes );
  });

  after( async() => {
    await api.stop();
    await db.disconnect();
  });

  describe( '#get', () => {

    it( 'should get a ui theme', async() => {
      await Ui.create({ user_id, theme: 'dark' });

      const res = await client.get( `ui/${ user_id }` );

      assert.strictEqual( res.status, 200 );
      assert.strictEqual( res.data.theme, 'dark' );
    });

  });

  describe( '#save', () => {

    it( 'should create a new ui theme', async() => {
      const res = await client.post( path, { user_id, theme: 'pattern' } );

      assert.strictEqual( res.status, 201 );

      const inserted = await Ui.findOne({ user_id });

      assert.strictEqual( inserted.theme, 'pattern' );
    });

    it( 'should update a ui theme', async() => {
      await Ui.create({ user_id, theme: 'pattern' });

      const res = await client.post( path, { user_id, theme: 'pattern2' } );

      assert.strictEqual( res.status, 201 );

      const updated = await Ui.findOne({ user_id });

      assert.strictEqual( updated.theme, 'pattern2' );
    });

  });

});
