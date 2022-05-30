const chai             = require('chai');
const chaiSubset       = require('chai-subset');
const dbUtils          = require('../../utils/db');
const db               = require('../../../lib/db');
const api              = require('../../utils/api');
const client           = require('../../utils/client');
const ObjectID         = require('mongoose').Types.ObjectId;
const Meeting          = require('../../../lib/models/meeting');
const Participant      = require('../../../lib/models/participant');
const Topic            = require('../../../lib/models/topic');
const topicFaker       = require('../../fakes/topic');
const participantFaker = require('../../fakes/participant');
const meetingFaker     = require('../../fakes/meeting');

chai.use( chaiSubset );

const assert = chai.assert;

describe( 'controllers/meeting', () => {

  before( async() => {
    await api.start();
    await db.connect();
    await dbUtils.clean();

    const res = await client.post(
      '/user/register',
      { username: 'user', password: 'pass', email: 'email' }
    );

    this.user = res.data.user;

    client.defaults.headers.common['Authorization'] = res.data.token;
  });

  beforeEach( async() => {
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
      const meeting = meetingFaker({
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
      const meeting = meetingFaker();

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
      const meeting = meetingFaker({ owner_id: this.user._id });

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
      const meeting = meetingFaker({ owner_id: this.user._id });

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
      const meeting = meetingFaker();

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
      const meeting = meetingFaker({ owner_id: this.user._id });

      const { _id } = await Meeting.create( meeting );

      const topics = Array.from({ length: 3 }).map( () => {
        return topicFaker({ meeting_id: _id });
      });

      const participants = Array.from({ length: 3 }).map( () => {
        return participantFaker({ meeting_id: _id });
      });

      await Topic.insertMany( topics );
      await Participant.insertMany( participants );

      const { data } = await client.get( `/meeting/${ _id }/aggregate` );

      assert.containSubset(
        data,
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
      const meeting = meetingFaker();

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
      const meeting = meetingFaker({
        _id: new ObjectID,
        owner_id: this.user._id
      });

      const { data } = await client.post(
        '/meeting/aggregate',
        meeting
      );

      const createdMeeting = await Meeting.findById( data._id );

      assert.containSubset(
        createdMeeting,
        {
          name: meeting.name,
          date: meeting.date.toISOString()
        }
      );
    });

    it( 'should create meeting with participants', async() => {
      const meeting = meetingFaker({
        _id: new ObjectID,
        owner_id: this.user._id
      });

      const participants = Array.from({ length: 3 }).map( () => {
        return participantFaker({ meeting_id: meeting._id });
      });

      const { data } = await client.post(
        '/meeting/aggregate',
        {
          ...meeting,
          participants
        }
      );

      assert.strictEqual( data.participants.length, 3 );

      const createdParticipants = await Participant.find({
        meeting_id: data._id
      });

      assert.strictEqual( createdParticipants.length, 3 );
    });

    it( 'should create meeting with topics', async() => {
      const meeting = meetingFaker({
        _id: new ObjectID,
        owner_id: this.user._id
      });

      const topic = topicFaker({ meeting_id: meeting._id });

      const { data } = await client.post(
        '/meeting/aggregate',
        {
          ...meeting,
          topics: [ topic ]
        }
      );

      assert.strictEqual( data.topics.length, 1 );

      const createdTopics = await Topic.find({
        meeting_id: data._id
      });

      assert.strictEqual( createdTopics.length, 1 );

      assert.strictEqual( createdTopics[ 0 ].name, topic.name );
      assert.strictEqual( createdTopics[ 0 ].description, topic.description );
    });

    it( 'should update a meeting', async() => {
      const meeting = meetingFaker({ owner_id: this.user._id });

      const { _id } = await Meeting.create( meeting );

      const update = {
        meeting_id: _id.toString(),
        name: 'meeting 2',
        date: new Date().toISOString()
      };

      const { data } = await client.post(
        '/meeting/aggregate',
        update
      );

      assert.strictEqual( data.name, update.name );
      assert.strictEqual( data.date, update.date );
      assert.strictEqual( data._id, update.meeting_id );

      const [ updated ] = await Meeting.find({ _id });

      assert.strictEqual(
        this.user._id.toString(),
        updated.owner_id.toString()
      );

      assert.strictEqual( update.name, updated.name );
      assert.strictEqual( update.date, updated.date );
    });

    it( 'should update a meetings topics', async() => {
      const meeting = meetingFaker({
        _id: new ObjectID,
        owner_id: this.user._id
      });

      const { _id } = await Meeting.create( meeting );

      const new_topic = ( await Topic.create(
        topicFaker({ owner_id: this.user._id, meeting_id: _id })
      ) )._doc;

      const topic = { ...new_topic };

      topic.name  = 'new topic name';
      topic.likes = [ this.user.email.toString() ];

      const payload = {
        meeting_id: _id.toString(),
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
      const meeting = meetingFaker({ owner_id: this.user._id });

      const { _id } = await Meeting.create( meeting );

      const topic = topicFaker({ meeting_id: _id });

      await Topic.create( topic );

      const payload = {
        meeting_id: _id.toString(),
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
      const meeting = meetingFaker({ owner_id: this.user._id });

      const { _id } = await Meeting.create( meeting );

      const participant = participantFaker({ meeting_id: _id });

      await Participant.create( participant );

      const payload = {
        meeting_id: _id.toString(),
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
      const meeting = meetingFaker();

      const created = await Meeting.create( meeting );

      const { _id } = created;

      try {
        await client.post(
          `/meeting/aggregate`,
          { ...created, _id: undefined, meeting_id: _id }
        );

        assert.fail('accepted request from unauthorized user');
      } catch ( err ) {
        assert.strictEqual( err.response.status, 403 );
        assert.strictEqual( err.response.data, 'unauthorized' );
      }
    });

  });

});
