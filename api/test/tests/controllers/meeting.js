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
const topicFake       = require('../../fakes/topic');
const participantFake = require('../../fakes/participant');
const meetingFake     = require('../../fakes/meeting');

chai.use( chaiSubset );

const assert = chai.assert;

const meeting_id = new ObjectID();
const owner_id   = new ObjectID();

const topic1 = topicFake({ meeting_id });
const topic2 = topicFake({ meeting_id });

const participant1  = participantFake({ meeting_id });
const participant2  = participantFake({ meeting_id });

const meeting = meetingFake({ owner_id });

describe( 'controllers/meeting', () => {

  before( async() => {
    await api.start();
    await db.connect();

    const res = await client.post(
      '/user/register',
      { username: 'user', password: 'pass', email: 'email' }
    );

    this.user = res.data.user;

    client.defaults.headers.common['Authorization'] = res.data.token;
  });

  beforeEach( async() => {
    await dbUtils.clean();
  });

  after( async() => {
    await api.stop();
    await db.disconnect();
  });

  describe( '#index', () => {

    it( 'should fetch all meetings', async() => {
      Meeting.create( meeting );
      Meeting.create( meeting );

      const meetings = await client.get('/meeting');

      assert.containSubset(
        meetings.data[ 0 ],
        {
          name: meeting.name,
          owner_id: meeting.owner_id.toString(),
          date: meeting.date.toString()
        }
      );

      assert.containSubset(
        meetings.data[ 1 ],
        {
          name: meeting.name,
          owner_id: meeting.owner_id.toString(),
          date: meeting.date.toString()
        }
      );
    });

  });

  describe( '#display', () => {

    it( 'should fetch meeting with participants and topics', async() => {
      const { _id } = await Meeting.create({ ...meeting, _id: meeting_id });


      const newTopic = await Topic.create(
        topicFake({ owner_id: this.user._id, meeting_id })
      )._doc;

      await Participant.create(
        participant1
      );

      const { data } = await client.get( `/meeting/${ _id }` );

      assert.containSubset(
        data[ 0 ],
        {
          name: meeting.name,
          date: meeting.date.toString(),
          owner_id: meeting.owner_id.toString()
        }
      );

      assert.containSubset(
        data[ 0 ].participants[ 0 ],
        { ...participant1, meeting_id: meeting_id.toString() }
      );

      assert.containSubset(
        data[ 0 ].topics[ 0 ],
        {
          ...newTopic,
          meeting_id: meeting_id.toString()
        }
      );
    });

  });

  describe( '#save', () => {

    const payload = {
      ...meeting,
      participants: [ participant1, participant2 ],
      topics: [ topic1, topic2 ]
    };

    it( 'should create meeting', async() => {
      const { data } = await client.post(
        '/meeting',
        payload
      );

      const createdMeeting = await Meeting.findById( data._id );

      assert.containSubset(
        createdMeeting,
        {
          name: payload.name,
          date: payload.date.toISOString()
        }
      );
    });

    it( 'should create meeting with participants', async() => {
      const { data } = await client.post(
        '/meeting',
        payload
      );

      const createdParticipants = await Participant.find({
        meeting_id: data._id
      });

      assert.containSubset(
        createdParticipants[ 0 ],
        participant1
      );

      assert.containSubset(
        createdParticipants[ 1 ],
        participant2
      );
    });

    it( 'should create meeting with topics', async() => {
      const { data } = await client.post(
        '/meeting',
        payload
      );

      const createdTopics = await Topic.find({
        meeting_id: data._id
      });

      assert.containSubset(
        createdTopics[ 0 ],
        topic1
      );

      assert.containSubset(
        createdTopics[ 1 ],
        topic2
      );
    });

    it( 'should update a meeting', async() => {
      const { _id } = await Meeting.create( meeting );

      const update = {
        meeting_id: _id.toString(),
        name: 'meeting 2',
        date: new Date().toISOString()
      };

      const { data } = await client.post(
        '/meeting',
        update
      );

      assert.strictEqual( data.name, update.name );
      assert.strictEqual( data.date, update.date );
      assert.strictEqual( data._id, update.meeting_id );

      const [ updated ] = await Meeting.find({ _id });

      assert.strictEqual( owner_id.toString(), updated.owner_id.toString() );
      assert.strictEqual( update.name, updated.name );
      assert.strictEqual( update.date, updated.date );
    });

    it( 'should update a meetings topics', async() => {
      const { _id } = await Meeting.create( meeting );

      const newTopic = ( await Topic.create(
        topicFake({ owner_id: this.user._id, meeting_id: _id })
      ) )._doc;

      const topic = { ...newTopic };

      topic.name  = 'new topic name';
      topic.likes = [ owner_id.toString() ];

      const payload = {
        meeting_id: _id.toString(),
        topics: [ topic ]
      };

      const { data: { topics: [ doc ] } } = await client.post(
        '/meeting',
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
      const { _id } = await Meeting.create( meeting );

      const topic = {
        ...topic1,
        meeting_id: _id.toString()
      };

      await Topic.create( topic );

      const payload = {
        meeting_id: _id.toString(),
        topics: []
      };

      const { data } = await client.post(
        '/meeting',
        payload
      );

      assert.strictEqual( data.topics.length, 0 );

      const deleted = await Topic.find({ meeting_id: _id });

      assert.strictEqual( deleted.length, 0 );
    });

    it( 'should delete old meeting participants', async() => {
      const { _id } = await Meeting.create( meeting );

      const participant = {
        ...participant1,
        meeting_id: _id.toString()
      };

      await Participant.create( participant );

      const payload = {
        meeting_id: _id.toString(),
        participants: []
      };

      const { data } = await client.post(
        '/meeting',
        payload
      );

      assert.strictEqual( data.participants.length, 0 );

      const deleted = await Participant.find({ meeting_id: _id });

      assert.strictEqual( deleted.length, 0 );
    });

  });

});
