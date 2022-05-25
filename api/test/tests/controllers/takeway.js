const { assert }    = require('chai');
const dbUtils       = require('../../utils/db');
const db            = require('../../../lib/db');
const api           = require('../../utils/api');
const client        = require('../../utils/client');
const takeawayFaker = require('../../fakes/takeaway');
const topicFaker    = require('../../fakes/topic');
const Takeaway      = require('../../../lib/models/takeaway');

describe( 'api/lib/controllers/takeaway', () => {

  before( async() => {
    await api.start();
    await db.connect();
    await dbUtils.clean();

    this.user = ( await client.post(
      '/user/register',
      { username: 'user', password: 'pass', email: 'email' }
    ) ).data;

    this.user2 = ( await client.post(
      '/user/register',
      { username: 'user2', password: 'pass2', email: 'email2' }
    ) ).data;
  });

  beforeEach( async() => {
    client.defaults.headers.common['Authorization'] = this.user.token;

    await dbUtils.clean([ 'takeaways', 'topics' ]);

    const fake = topicFaker();

    this.topic = ( await client.post(
      '/topic',
      fake
    ) ).data;
  });

  after( async() => {
    await api.stop();
    await db.disconnect();
  });

  describe( '#create', () => {
    const path = '/takeaway';

    it( 'should create takeaway with valid topic', async() => {
      const takeaway = takeawayFaker({
        topic_id: this.topic._id,
        owner_id: this.user.user._id
      });

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
          name: takeaway.name,
          description: takeaway.description,
          reactions: []
        }
      );
    });

  });

  describe( '#update', () => {

    const path = '/takeaway';

    beforeEach( async() => {
      const fake = takeawayFaker();

      this.takeaway = ( await client.post(
        path, fake )
      ).data;
    });

    it( 'should update a takeaway', async() => {
      const updates = { description: 'new description', name: 'new name' };

      const { status, data } = await client.patch(
        path + '/' +  this.takeaway._id,
        updates
      );

      assert.strictEqual( status, 200 );
      assert.strictEqual( data.name, 'new name' );
      assert.strictEqual( data.description, 'new description' );
      assert.strictEqual( data.topic_id, this.takeaway.topic_id );

      const found = await Takeaway.findOne({ _id: data._id });

      assert.strictEqual( found.name, 'new name' );
      assert.strictEqual( found.description, 'new description' );
      assert.strictEqual( found.topic_id.toString(), this.takeaway.topic_id );
    });

    it( 'should 403 if not takeaway owner', async() => {
      client.defaults.headers.common['Authorization'] = this.user2.token;

      try {
        await client.patch(
          path + '/' +  this.takeaway._id,
          {}
        );

        assert.fail('Accepted wrong owner');
      } catch ( err ) {
        assert.strictEqual( err.response.status, 403 );
        assert.strictEqual( err.response.data, 'unauthorized' );
      }

      const found = await Takeaway.find({});

      assert.strictEqual( found.length, 1 );
    });

  });

  describe( '#delete', () => {

    const path = '/takeaway';

    it( 'should delete takeaway', async() => {
      const takeaway = takeawayFaker({ topic_id: this.topic._id });
      const resTakeaway = await client.post( path, takeaway );

      const res = await client.delete( path + '/' + resTakeaway.data._id );

      assert.strictEqual( res.status, 200 );
      assert.deepStrictEqual(
        res.data,
        { acknowledged: true, deletedCount: 1 }
      );

      const found = await Takeaway.findOne({ _id: resTakeaway.data._id });

      assert.strictEqual( found, null );
    });

    it( 'should 403 if not takeaway owner', async() => {
      const takeaway = takeawayFaker({ topic_id: this.topic._id });
      const resTakeaway = await client.post( path, takeaway );

      client.defaults.headers.common['Authorization'] = this.user2.token;

      try {
        await client.delete( path + '/' + resTakeaway.data._id );

        assert.fail('Accepted wrong owner');
      } catch ( err ) {
        assert.strictEqual( err.response.status, 403 );
        assert.strictEqual( err.response.data, 'unauthorized' );
      }

      const found = await Takeaway.find({});

      assert.strictEqual( found.length, 1 );
    });

  });

});
