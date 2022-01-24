const chai        = require('chai');
const chaiSubset  = require('chai-subset');
const dbUtils     = require('../../utils/db');
const db          = require('../../../lib/db');
const api         = require('../../utils/api');
const client      = require('../../utils/client');
const ObjectID    = require('mongoose').Types.ObjectId;
const Meeting     = require('../../../lib/models/meeting');
const Participant = require('../../../lib/models/participant');
const Topic       = require('../../../lib/models/topic');

chai.use( chaiSubset );

const assert = chai.assert;

const meeting_id = new ObjectID();
const owner_id   = new ObjectID();

const topic1 = { name: 'topic 1', meeting_id };
const topic2 = { name: 'topic 2', meeting_id };
const participant1  = { email: 'zbarnz@zbarnz.zbarnz', meeting_id };
const participant2  = { email: 'thudson@thudson.thudson', meeting_id };


const meeting = {
  name: 'Meeting 1',
  owner_id,
  date: new Date(),
  topics: [  topic1, topic2 ],
  participants: [ participant1, participant2 ]
};

describe( 'controllers/meeting', () => {

  before( async() => {
    await api.start();
    await db.connect();

    const res = await client.post(
      '/user/register',
      { username: 'user', password: 'pass', email: 'email' }
    );

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

      await Participant.create( participant1 );
      await Topic.create( topic1 );

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
          ...topic1,
          meeting_id: meeting_id.toString()
        }
      );
    });

  });

  describe( '#save', () => {

    it( 'should create meeting', async() => {
      const { data } = await client.post(
        '/meeting',
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
      const { data } = await client.post(
        '/meeting',
        meeting
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
        meeting
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

      const payload = {
        meeting_id: _id.toString(),
        name: 'meeting 2',
        date: new Date().toISOString()
      };

      const { data } = await client.post(
        '/meeting',
        payload
      );

      assert.containSubset(
        data,
        {
          ...payload,
          meeting_id: undefined,
          _id: payload.meeting_id,
          owner_id: owner_id.toString()
        }
      );
    });

    it( 'should update a meetings topics', async() => {
      const { _id } = await Meeting.create( meeting );

      const topic = {
        ...topic1,
        meeting_id: _id.toString()
      };

      await Topic.create( topic );

      topic.name  = 'new topic name';
      topic.likes = [ owner_id.toString() ];

      const payload = {
        meeting_id: _id.toString(),
        topics: [ topic ]
      };

      const { data } = await client.post(
        '/meeting',
        payload
      );

      assert.containSubset(
        data.topics[ 0 ],
        topic
      );
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
    });

  });

});
