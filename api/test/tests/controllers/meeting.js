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

const meeting_id = new ObjectID();
const owner_id   = new ObjectID();

const topic1 = topicFaker({ meeting_id });
const topic2 = topicFaker({ meeting_id });

const participant1  = participantFaker({ meeting_id });
const participant2  = participantFaker({ meeting_id });

const meeting = meetingFaker({ owner_id });

describe( 'controllers/meeting', () => {

  before( async() => {
    await api.start();
    await db.connect();
    await dbUtils.clean();

    const res = await client.post(
      '/user/register',
      { username: 'user', password: 'pass', email: 'email' }
    );

    const res2 = await client.post(
      '/user/register',
      { username: 'user2', password: 'pass2', email: 'email2' }
    );

    this.user = res.data.user;
    this.userToken = res.data.token;

    this.user2 = res2.data.user;
    this.user2Token = res2.data.token;
  });

  beforeEach( async() => {
    client.defaults.headers.common['Authorization'] = this.userToken;

    await dbUtils.clean();
  });

  after( async() => {
    await api.stop();
    await db.disconnect();
  });

  describe( '#index', () => {

    it( 'should fetch all meetings', async() => {
      await Meeting.create( meeting );
      await Meeting.create( meeting );

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
        topicFaker({ owner_id: this.user._id, meeting_id })
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
      topics: [ topic1, { ...topic2, owner_id: undefined } ]
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
        topicFaker({ owner_id: this.user._id, meeting_id: _id })
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

  describe( '#getTopics', () => {

    beforeEach( async() => {
      this.meeting = await Meeting.create(
        meetingFaker({ owner_id: this.user._id })
      );

      await Topic.insertMany([
        topicFaker({ meeting_id: this.meeting._id }),
        topicFaker({ meeting_id: this.meeting._id }),
        topicFaker()
      ]);
    });

    it( 'should return meetings topics', async() => {
      const { data } = await client.get(
        `/meeting/${ this.meeting._id }/topics`
      );

      assert.strictEqual( data.length, 2 );
    });

    it( 'should 403 if not meeting owner', async() => {
      client.defaults.headers.common['Authorization'] = this.user2Token;

      try {
        await client.get(
          `/meeting/${ this.meeting._id }/topics`
        );

        assert.fail('should have 403d');
      } catch ( err ) {
        assert.strictEqual( err.response.status, 403 );
        assert.strictEqual( err.response.data, 'unauthorized' );
      }
    });

  });

  describe( '#getParticipants', () => {

    beforeEach( async() => {
      this.meeting = await Meeting.create(
        meetingFaker({ owner_id: this.user._id })
      );

      await Participant.insertMany([
        participantFaker({ meeting_id: this.meeting._id }),
        participantFaker({ meeting_id: this.meeting._id }),
        participantFaker()
      ]);
    });

    it( 'should return meetings participants', async() => {
      const { data } = await client.get(
        `/meeting/${ this.meeting._id }/participants`
      );

      assert.strictEqual( data.length, 2 );
    });

    it( 'should 403 if not meeting owner', async() => {
      client.defaults.headers.common['Authorization'] = this.user2Token;

      try {
        await client.get(
          `/meeting/${ this.meeting._id }/topics`
        );

        assert.fail('should have 403d');
      } catch ( err ) {
        assert.strictEqual( err.response.status, 403 );
        assert.strictEqual( err.response.data, 'unauthorized' );
      }
    });

  });

});
