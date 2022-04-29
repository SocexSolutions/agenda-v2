const { assert }    = require('chai');
const dbUtils       = require('../../utils/db');
const db            = require('../../../lib/db');
const api           = require('../../utils/api');
const client        = require('../../utils/client');
const Topic         = require('../../../lib/models/topic');
const Takeaway      = require('../../../lib/models/takeaway');
const topicFaker    = require('../../fakes/topic');
const takeawayFaker = require('../../fakes/takeaway');

describe( 'api/lib/controllers/topic', () => {

  let user;
  let user2;

  before( async() => {
    await api.start();
    await db.connect();
    await dbUtils.clean();

    user = ( await client.post(
      '/user/register',
      { username: 'user3', password: 'pass', email: 'email3' }
    ) ).data;

    user2 = ( await client.post(
      '/user/register',
      { username: 'user2', password: 'pass', email: 'email2' }
    ) ).data;
  });

  beforeEach( async() => {
    client.defaults.headers.common['Authorization'] = user.token;
    await dbUtils.clean();
  });

  after( async() => {
    await api.stop();
    await db.disconnect();
  });

  describe( '#create', () => {
    const path = '/topic';

    it( 'should create topic with valid inputs', async() => {
      const topic = topicFaker();

      const res = await client.post( path, topic );

      assert( res.status === 201, 'failed to create topic with valid inputs' );

      assert(
        res.data.name === topic.name,
        'created topic with incorrect name: ' + res.data.name
      );

      const created = await Topic.find({});

      assert.strictEqual( created.length, 1 );
      assert.strictEqual( created[ 0 ].name, topic.name );
      assert.strictEqual( created[ 0 ].likes[ 0 ], topic.likes[ 0 ] );
      assert.deepEqual( created[ 0 ].meeting_id, topic.meeting_id );
    });

    it( 'should create topic without likes', async() => {
      const topic = topicFaker({ likes: [] });

      const res = await client.post( path, topic );

      assert( res.status === 201, 'failed to create topic without likes' );

      assert(
        res.data.likes.length === 0,
        'created topic with incorrect likes: ' + res.data.likes
      );

      const created = await Topic.find({});

      assert.strictEqual( created.length, 1 );
      assert.strictEqual( created[ 0 ].name, topic.name );
      assert.strictEqual( created[ 0 ].likes.length, 0 );
      assert.deepEqual( created[ 0 ].meeting_id, topic.meeting_id );
    });

    it( 'should not create topic without name', async() => {
      const topicWithoutName = topicFaker({ name: '' });

      const errorRegex = /^Topic validation failed: name/;

      try {
        await client.post( path, topicWithoutName );

        throw new Error('accepted topic without name');
      } catch ( err ) {
        assert(
          errorRegex.test( err.response.data ),
          'failed to create topic for wrong reason: ' + err.response.data
        );
      }

      const res = await Topic.find({});

      assert.strictEqual( res.length, 0 );
    });

    it( 'should not create topic without meeting_id', async() => {
      const topicWithoutMeetingId = topicFaker({ meeting_id: '' });
      const errorRegex = /^Topic validation failed: meeting_id/;

      try {
        await client.post( path, topicWithoutMeetingId );

        throw new Error('accepted topic without meeting_id');
      } catch ( err ) {
        assert(
          errorRegex.test( err.response.data ),
          'failed to create topic for wrong reason: ' + err.response.data
        );
      }

      const res = await Topic.find({});

      assert.strictEqual( res.length, 0 );
    });

  });

  describe( '#update', () => {

    beforeEach( async() => {
      this.topic = await Topic.create(
        topicFaker({ owner_id: user.user._id })
      );
    });

    it( 'should update topic name', async() => {
      const res = await client.post(
        '/topic/' + this.topic._id,
        { ...this.topic._doc, name: 'new name' }
      );

      assert.strictEqual( res.status, 200 );
      assert.strictEqual( res.data.name, 'new name' );

      const [ topic ] = await Topic.find({ _id: this.topic._id });

      assert.strictEqual( topic.name, 'new name' );
      assert.strictEqual( topic.status, this.topic.status );
      assert.deepEqual( topic.likes, this.topic.likes );
    });

    it( 'should update topic description', async() => {
      const res = await client.post(
        '/topic/' + this.topic._id,
        { ...this.topic._doc, description: 'new description' }
      );

      assert.strictEqual( res.status, 200 );
      assert.strictEqual( res.data.description, 'new description' );

      const [ topic ] = await Topic.find({ _id: this.topic._id });

      assert.strictEqual( topic.description, 'new description' );
      assert.strictEqual( topic.status, this.topic.status );
      assert.deepEqual( topic.likes, this.topic.likes );
    });

    it( 'should 403 with incorrect subject identity', async() => {
      client.defaults.headers.common['Authorization'] = user2.token;

      try {
        await client.post(
          '/topic/' + this.topic._id,
          {}
        );
      } catch ( err ) {
        assert.strictEqual( err.response.status, 403 );
        assert.strictEqual( err.response.data, 'unauthorized' );
      }
    });

  });

  describe( '#like', () => {

    beforeEach( async() => {
      this.topic = await Topic.create( topicFaker() );
    });

    it( 'should add a topic like', async() => {
      const res = await client.patch(
        '/topic/' + this.topic._id + '/like',
        { email: 'thudson@agenda.com' }
      );

      assert.strictEqual( res.status, 200 );
      assert.isTrue( res.data.likes.includes('thudson@agenda.com') );

      const [ topic ] = await Topic.find({});

      assert.isTrue( topic.likes.includes('thudson@agenda.com') );
    });

    it( 'should remove a topic like', async() => {
      const res = await client.patch(
        '/topic/' + this.topic._id + '/like',
        { email: 'bryan@bacon.com' }
      );

      assert.strictEqual( res.status, 200 );
      assert.isFalse( res.data.likes.includes('bryan@bacon.com') );

      const [ topic ] = await Topic.find({});

      assert.isFalse( topic.likes.includes('bryan@bacon.com') );
    });

  });

  describe( '#status', () => {

    beforeEach( async() => {
      this.topic = await Topic.create( topicFaker() );
    });

    it( 'should set the topics status', async() => {
      const res = await client.patch(
        '/topic/' + this.topic._id + '/status',
        { status: 'discussed' }
      );

      assert.strictEqual( res.status, 200 );
      assert.strictEqual( res.data.status, 'discussed' );

      const [ topic ] = await Topic.find({});

      assert.strictEqual( topic.status, 'discussed' );
      assert.strictEqual( topic.name, this.topic.name );
    });
  });

  describe( '#getTakeaways', () => {

    it( 'should get topic\'s takeaways', async() => {
      const topic = topicFaker();

      const insertedTopic = await Topic.create( topic );

      const takeaway = takeawayFaker({
        topic_id: insertedTopic._id.toString(),
        owner_id: user.user._id
      });

      await Takeaway.create( takeaway );

      const { data: [ foundTakeaway ] } = await client.get(
        '/topic/' + insertedTopic._id + '/takeaways'
      );

      assert.strictEqual( takeaway.name, foundTakeaway.name );
      assert.strictEqual( takeaway.description, foundTakeaway.description );
      assert.strictEqual( takeaway.topic_id, foundTakeaway.topic_id );
      assert.strictEqual( takeaway.owner_id, foundTakeaway.owner_id );
    });

  });

});
