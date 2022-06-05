const { assert }   = require('chai');
const dbUtils      = require('../../utils/db');
const db           = require('../../../lib/db');
const api          = require('../../utils/api');
const Topic        = require('../../../lib/models/topic');
const Takeaway     = require('../../../lib/models/takeaway');
const Meeting      = require('../../../lib/models/meeting');
const fakeTopic    = require('../../fakes/topic');
const fakeTakeaway = require('../../fakes/takeaway');
const fakeMeeting  = require('../../fakes/meeting');
const rewire       = require('rewire');

describe( 'lib/controllers/topic', () => {

  before( async() => {
    this.Client = rewire('../../utils/client');

    await api.start();
    await db.connect();
    await dbUtils.clean();

    const res = ( await this.Client.post(
      '/user/register',
      { username: 'user3', password: 'pass', email: 'email3' }
    ) ).data;

    const res2 = ( await this.Client.post(
      '/user/register',
      { username: 'user2', password: 'pass', email: 'email2' }
    ) ).data;

    this.user  = res.user;
    this.token = res.token;

    this.user2  = res2.user;
    this.token2 = res2.token;
  });

  beforeEach( async() => {
    this.Client.defaults.headers.common['Authorization'] = this.token;
    await dbUtils.clean([ 'topics', 'takeaways', 'meetings' ]);

    this.meeting = await Meeting.create(
      fakeMeeting({ owner_id: this.user._id })
    );
  });

  after( async() => {
    await api.stop();
    await db.disconnect();
  });

  describe( '#create', () => {

    const path = '/topic';

    it( 'should create topic with valid inputs', async() => {
      const topic = fakeTopic({ meeting_id: this.meeting._id });

      const res = await this.Client.post( path, topic );

      assert.equal(
        res.status,
        201,
        'failed to create topic with valid inputs'
      );

      assert.equal(
        res.data.name,
        topic.name,
        'created topic with incorrect name: ' + res.data.name
      );

      const created = await Topic.find({});

      assert.equal( created.length, 1 );
      assert.equal( created[ 0 ].name, topic.name );
      assert.equal( created[ 0 ].likes[ 0 ], topic.likes[ 0 ] );
      assert.deepEqual( created[ 0 ].meeting_id, topic.meeting_id );
    });

    it( 'should 403 if not owner or participant', async() => {
      this.Client.defaults.headers.common['Authorization'] = this.token2;

      const topic = fakeTopic({ meeting_id: this.meeting._id });

      await assert.isRejected(
        this.Client.post( path, topic ),
        'Request failed with status code 403'
      );
    });

  });

  describe( '#update', () => {

    beforeEach( async() => {
      this.topic = await Topic.create(
        fakeTopic({ owner_id: this.user._id })
      );
    });

    it( 'should update topic name', async() => {
      const res = await this.Client.patch(
        '/topic/' + this.topic._id,
        { ...this.topic._doc, name: 'new name', description: 'new description' }
      );

      assert.strictEqual( res.status, 200 );
      assert.strictEqual( res.data.name, 'new name' );

      const [ topic ] = await Topic.find({ _id: this.topic._id });

      assert.strictEqual( topic.name, 'new name' );
      assert.strictEqual( topic.description, 'new description' );
      assert.strictEqual( topic.status, this.topic.status );
      assert.deepEqual( topic.likes, this.topic.likes );
    });

    it( 'should 403 if not topic owner', async() => {
      this.Client.defaults.headers.common['Authorization'] = this.token2;

      await assert.isRejected(
        this.Client.patch(
          '/topic/' + this.topic._id,
          {}
        ),
        'Request failed with status code 403'
      );
    });

  });

  describe( '#like', () => {

    beforeEach( async() => {
      this.topic = await Topic.create(
        fakeTopic({ meeting_id: this.meeting._id })
      );
    });

    it( 'should add a topic like', async() => {
      const res = await this.Client.patch(
        '/topic/' + this.topic._id + '/like',
        { email: 'thudson@agenda.com' }
      );

      assert.strictEqual( res.status, 200 );
      assert.isTrue( res.data.likes.includes('thudson@agenda.com') );

      const [ topic ] = await Topic.find({});

      assert.isTrue( topic.likes.includes('thudson@agenda.com') );
    });

    it( 'should remove a topic like', async() => {
      const res = await this.Client.patch(
        '/topic/' + this.topic._id + '/like',
        { email: 'bryan@bacon.com' }
      );

      assert.strictEqual( res.status, 200 );
      assert.isFalse( res.data.likes.includes('bryan@bacon.com') );

      const [ topic ] = await Topic.find({});

      assert.isFalse( topic.likes.includes('bryan@bacon.com') );
    });

    it( 'should 403 if not owner or participant', async() => {
      this.Client.defaults.headers.common['Authorization'] = this.token2;

      await assert.isRejected(
        this.Client.patch(
          '/topic/' + this.topic._id + '/like',
          { email: 'bryan@bacon.com' }
        ),
        'Request failed with status code 403'
      );
    });

  });

  describe( '#status', () => {

    beforeEach( async() => {
      this.topic = await Topic.create(
        fakeTopic({ meeting_id: this.meeting._id })
      );
    });

    it( 'should set the topics status', async() => {
      const res = await this.Client.patch(
        '/topic/' + this.topic._id + '/status',
        { status: 'discussed' }
      );

      assert.strictEqual( res.status, 200 );
      assert.strictEqual( res.data.status, 'discussed' );

      const [ topic ] = await Topic.find({});

      assert.strictEqual( topic.status, 'discussed' );
      assert.strictEqual( topic.name, this.topic.name );
    });

    it( 'should 403 if not owner or participant', async() => {
      this.Client.defaults.headers.common['Authorization'] = this.token2;

      await assert.isRejected(
        this.Client.patch(
          '/topic/' + this.topic._id + '/status',
          { status: 'discussed' }
        ),
        'Request failed with status code 403'
      );
    });

  });

  describe( '#getTakeaways', () => {

    beforeEach( async() => {
      this.inserted_topic = await Topic.create(
        fakeTopic({ meeting_id: this.meeting._id })
      );
    });

    it( 'should get topic\'s takeaways', async() => {
      const takeaway = fakeTakeaway({
        topic_id: this.inserted_topic._id.toString(),
        owner_id: this.user._id
      });

      await Takeaway.create( takeaway );

      const { data: [ foundTakeaway ] } = await this.Client.get(
        '/topic/' + this.inserted_topic._id + '/takeaways'
      );

      assert.strictEqual( takeaway.name, foundTakeaway.name );
      assert.strictEqual( takeaway.description, foundTakeaway.description );
      assert.strictEqual( takeaway.topic_id, foundTakeaway.topic_id );
      assert.strictEqual( takeaway.owner_id, foundTakeaway.owner_id );
    });

    it( 'should 403 if not owner or participant', async() => {
      this.Client.defaults.headers.common['Authorization'] = this.token2;

      await assert.isRejected(
        this.Client.get(
          '/topic/' + this.inserted_topic._id + '/takeaways'
        ),
        'Request failed with status code 403'
      );
    });

  });

});
