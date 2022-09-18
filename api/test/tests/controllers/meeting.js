const chai            = require('chai');
const chaiSubset      = require('chai-subset');
const dbUtils         = require('../../utils/db');
const db              = require('../../../lib/db');
const api             = require('../../utils/api');
const client          = require('../../utils/client');
const ObjectID        = require('mongoose').Types.ObjectId;
const Meeting         = require('../../../lib/models/meeting');
const Participant     = require('../../../lib/models/participant');
const Topic           = require('../../../lib/models/topic');
const fakeTopic       = require('../../fakes/topic');
const fakeParticipant = require('../../fakes/participant');
const fakeMeeting     = require('../../fakes/meeting');

chai.use( chaiSubset );

const assert = chai.assert;

describe( 'lib/controllers/meeting', () => {

  before( async() => {
    await api.start();
    await db.connect();
    await dbUtils.clean();

    const res = await client.post(
      '/user/register',
      { username: 'user', password: 'pass', email: 'email' }
    );

    this.user  = res.data.user;
    this.token = res.data.token;

    const res2 = await client.post(
      '/user/register',
      { username: 'user2', password: 'pass2', email: 'email2' }
    );

    this.user2  = res2.data.user;
    this.token2 = res2.data.token;
  });

  beforeEach( async() => {
    client.defaults.headers.common['Authorization'] = this.token;

    await dbUtils.clean([
      'participants',
      'topics',
      'meetings',
      'takeaways'
    ]);
  });

  after( async() => {
    await api.stop();
    await db.disconnect();
  });

  describe( '#get', () => {

    it( 'should fetch a meeting', async() => {
      const meeting = fakeMeeting({
        name: 'meeting 1',
        owner_id: this.user._id
      });

      const created = await Meeting.create( meeting );

      const { data: res } = await client.get( `/meeting/${ created._id }` );

      assert.strictEqual( res.name, created.name );
      assert.strictEqual( res._id, created._id.toString() );
      assert.strictEqual( res.date, created.date );
    });

    it( 'should 403 if not meeting owner or participant', async() => {
      const meeting = fakeMeeting();

      const created = await Meeting.create( meeting );

      try {
        await client.get( `/meeting/${ created._id }` );

        assert.fail('accepted unrelated user');
      } catch ( err ) {
        assert.strictEqual( err.response.status, 403 );
        assert.strictEqual( err.response.data, 'unauthorized' );
      }
    });

  });

  describe( '#create', () => {

    it( 'should create a meeting', async() => {
      const meeting = fakeMeeting({ owner_id: this.user._id });

      const { data: res } = await client.post( `/meeting`, meeting );

      assert.strictEqual( res.name, meeting.name );
      assert.strictEqual( res.owner_id, this.user._id.toString() );
      assert.strictEqual( res.date, meeting.date.toISOString() );

      const found = await Meeting.findOne({ _id: res._id });

      assert.strictEqual( found.name, meeting.name );
      assert.strictEqual( res.owner_id, this.user._id.toString() );
      assert.strictEqual( found._id.toString(), res._id );
      assert.strictEqual( found.date, meeting.date.toISOString() );
    });

  });

  describe( '#update', () => {

    it( 'should update a meeting', async() => {
      const meeting = fakeMeeting({ owner_id: this.user._id });

      const created = await Meeting.create( meeting );

      const newDate = new Date( 0 ).toISOString();

      const { data: res } = await client.patch(
        `/meeting/${ created._id }`,
        { ...meeting, name: 'new name', date: newDate }
      );

      assert.strictEqual( res.name, 'new name' );
      assert.strictEqual( res.owner_id, this.user._id.toString() );
      assert.strictEqual( res.date, newDate );

      const found = await Meeting.findOne({ _id: res._id });

      assert.strictEqual( found.name, 'new name' );
      assert.strictEqual( res.owner_id, this.user._id.toString() );
      assert.strictEqual( found._id.toString(), res._id );
      assert.strictEqual( found.date, newDate );
    });

    it( 'should 403 if not meeting owner', async() => {
      const meeting = fakeMeeting();

      const created = await Meeting.create( meeting );

      try {
        await client.patch(
          `/meeting/${ created._id }`,
          { ...meeting, name: 'new name' }
        );

        assert.fail('accepted wrong owner');
      } catch ( err ) {
        assert.strictEqual( err.response.status, 403 );
        assert.strictEqual( err.response.data, 'unauthorized' );
      }
    });

  });

  describe( '#aggregate', () => {

    it( 'should fetch meeting with participants and topics', async() => {
      const meeting = fakeMeeting({ owner_id: this.user._id });

      const { _id } = await Meeting.create( meeting );

      const topics = Array.from({ length: 3 }).map( () => {
        return fakeTopic({ meeting_id: _id });
      });

      const participants = Array.from({ length: 3 }).map( () => {
        return fakeParticipant({ meeting_id: _id });
      });

      await Topic.insertMany( topics );
      await Participant.insertMany( participants );

      const { data } = await client.get( `/meeting/${ _id }/aggregate` );

      assert.containSubset(
        data.meeting,
        {
          name: meeting.name,
          date: meeting.date.toString(),
          owner_id: this.user._id.toString()
        }
      );

      assert.strictEqual( data.topics.length, 3 );
      assert.strictEqual( data.participants.length, 3 );
    });

    it( 'should 403 if not meeting owner', async() => {
      const meeting = fakeMeeting();

      const { _id } = await Meeting.create( meeting );

      try {
        await client.get( `/meeting/${ _id }/aggregate` );
        assert.fail('accepted request from unauthorized user');
      } catch ( err ) {
        assert.strictEqual( err.response.status, 403 );
        assert.strictEqual( err.response.data, 'unauthorized' );
      }
    });

  });

  describe( '#aggregateSave', () => {

    it( 'should create meeting', async() => {
      const meeting = fakeMeeting({
        owner_id: this.user._id
      });

      const { data: { meeting: res_meeting } } = await client.post(
        '/meeting/aggregate',
        { meeting }
      );

      assert.equal( res_meeting.name, meeting.name );

      const createdMeeting = await Meeting.findById( res_meeting._id );

      assert.containSubset(
        createdMeeting,
        {
          name: meeting.name,
          date: meeting.date.toISOString()
        }
      );
    });

    it( 'should create meeting with participants', async() => {
      const meeting = fakeMeeting({ owner_id: this.user._id });

      const participants = Array.from({ length: 3 }).map( () => {
        return fakeParticipant({ meeting_id: meeting._id });
      });

      const { data } = await client.post(
        '/meeting/aggregate',
        {
          meeting,
          participants
        }
      );

      assert.strictEqual( data.participants.length, 3 );

      const createdParticipants = await Participant.find({
        meeting_id: data.meeting._id
      });

      assert.strictEqual( createdParticipants.length, 3 );
    });

    it( 'should create meeting with topics', async() => {
      const meeting = fakeMeeting({ owner_id: this.user._id });

      const topic = fakeTopic({ meeting_id: meeting._id });

      const { data } = await client.post(
        '/meeting/aggregate',
        {
          meeting,
          topics: [ topic ]
        }
      );

      assert.strictEqual( data.topics.length, 1 );

      const createdTopics = await Topic.find({
        meeting_id: data.meeting._id
      });

      assert.strictEqual( createdTopics.length, 1 );

      assert.strictEqual( createdTopics[ 0 ].name, topic.name );
      assert.strictEqual( createdTopics[ 0 ].description, topic.description );
    });

    it( 'should update a meeting', async() => {
      const meeting = fakeMeeting({ owner_id: this.user._id });

      const { _id } = await Meeting.create( meeting );

      const update = {
        _id: _id.toString(),
        name: 'meeting 2',
        date: new Date().toISOString()
      };

      const { data } = await client.post(
        '/meeting/aggregate',
        { meeting: update }
      );

      assert.strictEqual( data.meeting.name, update.name );
      assert.strictEqual( data.meeting.date, update.date );
      assert.strictEqual(
        data.meeting._id,
        update._id,
        'bad meeting id'
      );

      const [ updated ] = await Meeting.find({ _id });

      assert.strictEqual(
        this.user._id.toString(),
        updated.owner_id.toString(),
        'bad owner id'
      );

      assert.strictEqual( update.name, updated.name );
      assert.strictEqual( update.date, updated.date );
    });

    it( 'should update a meetings topics', async() => {
      const meeting = fakeMeeting({
        _id: new ObjectID,
        owner_id: this.user._id
      });

      const { _id } = await Meeting.create( meeting );

      const new_topic = ( await Topic.create(
        fakeTopic({ owner_id: this.user._id, meeting_id: _id })
      ) )._doc;

      const topic = { ...new_topic };

      topic.name  = 'new topic name';
      topic.likes = [ this.user.email.toString() ];

      const payload = {
        meeting: {  _id: _id.toString() },
        topics: [ topic ]
      };

      const { data: { topics: [ doc ] } } = await client.post(
        '/meeting/aggregate',
        payload
      );

      assert.strictEqual( doc._id, topic._id.toString() );
      assert.strictEqual( doc.meeting_id, topic.meeting_id.toString() );
      assert.strictEqual( doc.name, topic.name );
      assert.strictEqual( doc.description, topic.description );

      const [ updated ] = await Topic.find({ meeting_id: _id.toString() });

      assert.strictEqual( updated.name, 'new topic name' );
    });

    it( 'should delete old meeting topics', async() => {
      const meeting = fakeMeeting({ owner_id: this.user._id });

      const { _id } = await Meeting.create( meeting );

      const topic = fakeTopic({ meeting_id: _id });

      await Topic.create( topic );

      const payload = {
        meeting: { _id: _id.toString() },
        topics: []
      };

      const { data } = await client.post(
        '/meeting/aggregate',
        payload
      );

      assert.strictEqual( data.topics.length, 0 );

      const deleted = await Topic.find({ meeting_id: _id });

      assert.strictEqual( deleted.length, 0 );
    });

    it( 'should delete old meeting participants', async() => {
      const meeting = fakeMeeting({ owner_id: this.user._id });

      const { _id } = await Meeting.create( meeting );

      const participant = fakeParticipant({ meeting_id: _id });

      await Participant.create( participant );

      const payload = {
        meeting: { _id: _id.toString() },
        participants: []
      };

      const { data } = await client.post(
        '/meeting/aggregate',
        payload
      );

      assert.strictEqual( data.participants.length, 0 );

      const deleted = await Participant.find({ meeting_id: _id });

      assert.strictEqual( deleted.length, 0 );
    });

    it( 'should 403 if not meeting owner', async() => {
      const meeting = fakeMeeting();

      const created = await Meeting.create( meeting );

      const { _id } = created;

      try {
        await client.post(
          `/meeting/aggregate`,
          { meeting: { ...created, _id } }
        );

        assert.fail('accepted request from unauthorized user');
      } catch ( err ) {
        assert.strictEqual( err.response.status, 403 );
        assert.strictEqual( err.response.data, 'unauthorized' );
      }
    });

  });

  describe( '#getTopics', () => {

    beforeEach( async() => {
      const meeting = fakeMeeting({
        owner_id: this.user._id
      });

      this.meeting = await Meeting.create( meeting );
    });

    it( 'should return a meetings topics', async() => {
      const topics = Array.from({ length: 3 }).map( () => {
        return fakeTopic({ meeting_id: this.meeting._id });
      });

      await Topic.insertMany( topics );

      const res = await client.get( `/meeting/${ this.meeting._id }/topics` );

      assert.equal( res.status, 200 );
      assert.equal( res.data.length, 3, 'didnt get topics' );
    });

    it( 'should 403 if not owner or participant', async() => {
      client.defaults.headers.common['Authorization'] = this.token2;

      await assert.isRejected(
        client.get(
          `/meeting/${ this.meeting._id }/topics`
        ),
        'Request failed with status code 403'
      );
    });

  });

  describe( '#getParticipants', () => {

    beforeEach( async() => {
      const meeting = fakeMeeting({
        owner_id: this.user._id
      });

      this.meeting = await Meeting.create( meeting );
    });

    it( 'should get a meetings participants', async() => {
      const participants = Array.from({ length: 3 }).map( () => {
        return fakeParticipant({ meeting_id: this.meeting._id });
      });

      await Participant.insertMany( participants );

      const res = await client.get(
        `/meeting/${ this.meeting._id }/participants`
      );

      assert.equal( res.status, 200 );
      assert.equal( res.data.length, 3 );
    });

    it( 'should 403 if not meeting owner or participant', async() => {
      client.defaults.headers.common['Authorization'] = this.token2;

      await assert.isRejected(
        client.get(
          `/meeting/${ this.meeting._id }/topics`
        ),
        'Request failed with status code 403'
      );
    });

  });

  describe( '#updateStatus', () => {

    beforeEach( async() => {
      const meeting = fakeMeeting({
        owner_id: this.user._id,
        status: 'draft'
      });

      this.meeting = await Meeting.create( meeting );
    });

    it( 'should update a meetings status', async() => {
      const res = await client.patch(
        `/meeting/${ this.meeting._id }/status`,
        { status: 'sent' }
      );

      assert.equal( res.status, 200 );
      assert.equal( res.data.status, 'sent' );
    });

    it( 'should 403 if not meeting owner', async() => {
      client.defaults.headers.common['Authorization'] = this.token2;

      await assert.isRejected(
        client.patch(
          `/meeting/${ this.meeting._id }/status`,
          { status: 'sent' }
        ),
        'Request failed with status code 403'
      );
    });

  });

});
