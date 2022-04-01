const { assert }    = require('chai');
const dbUtils       = require('../../utils/db');
const db            = require('../../../lib/db');
const api           = require('../../utils/api');
const client        = require('../../utils/client');
const takeawayFaker = require('../../fakes/takeaway');
const topicFaker    = require('../../fakes/topic');
const Takeaway      = require('../../../lib/models/takeaway');

describe( 'api/lib/controllers/topic', () => {

  before( async() => {
    await api.start();
    await db.connect();

    const res = await client.post(
      '/user/register',
      { username: 'user', password: 'pass', email: 'email' }
    );

    this.user = res.data;

    client.defaults.headers.common['Authorization'] = res.data.token;
  });

  beforeEach( async() => {
    await dbUtils.clean();

    const res = await client.post(
      '/topic',
      topicFaker()
    );

    this.topic = res.data;
  });

  after( async() => {
    await api.stop();
    await db.disconnect();
  });

  describe( '#create', () => {
    const path = '/takeaway';

    it( 'should create topic with valid topic', async() => {
      const takeaway = takeawayFaker({ topic_id: this.topic._id });

      const res = await client.post( path, takeaway );

      assert.strictEqual( res.status, 201 );
      assert.deepInclude(
        res.data,
        { ...takeaway, owner_id: takeaway.owner_id.toString() }
      );

      const created = await Takeaway.find({ topic_id: this.topic._id });

      assert.strictEqual( created[ 0 ].owner_id.toString(), takeaway.owner_id );
      assert.deepInclude(
        created[ 0 ],
        {
          content: takeaway.content,
          reactions: []
        }
      );
    });
  });

  describe( '#delete', async() => {
    const path = '/takeaway';

    it( 'should delete takeaway', async() => {
      const takeaway = takeawayFaker({ topic_id: this.topic._id });
      const resTakeaway = await client.post( path, takeaway );

      const res = await client.delete( path + '/' + resTakeaway.data._id );

      const res2 = await Takeaway.findOne({ _id: resTakeaway.data._id });

      assert.strictEqual( res.status, 200 );
      assert.deepStrictEqual(
        res.data,
        { acknowledged: true, deletedCount: 1 }
      );
      assert.strictEqual( res2, null );
    });

  });
});
