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

const fakeMeeting = {
  name:         'Meeting 1',
  owner_id:     new ObjectID().toString(),
  date:         new Date(),
  topics:       [ 'topic 1', 'topic 2' ],
  participants: [ 'participant 1', 'participant 2' ]
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
      Meeting.create( fakeMeeting );
      Meeting.create( fakeMeeting );

      const meetings = await client.get('/meeting');

      assert.containSubset(
        meetings.data[ 0 ],
        {
          name: fakeMeeting.name,
          owner_id: fakeMeeting.owner_id,
          date: fakeMeeting.date.toString()
        }
      );

      assert.containSubset(
        meetings.data[ 1 ],
        {
          name: fakeMeeting.name,
          owner_id: fakeMeeting.owner_id,
          date: fakeMeeting.date.toString()
        }
      );
    });

  });

  describe( '#display', () => {

    it( 'should fetch meeting with participants and topics', async() => {
      const { _id } = await Meeting.create( fakeMeeting );

      await Participant.create({
        email: fakeMeeting.participants[ 0 ],
        meeting_id: _id
      });

      await Topic.create({
        name: fakeMeeting.topics[ 0 ],
        meeting_id: _id
      });

      const res = await client.get( `/meeting/${ _id }` );

      assert.containSubset(
        res.data[ 0 ],
        {
          date:     fakeMeeting.date.toString(),
          name:     fakeMeeting.name,
          owner_id: fakeMeeting.owner_id
        }
      );

      assert.containSubset(
        res.data[ 0 ].participants[ 0 ],
        {
          email: fakeMeeting.participants[ 0 ],
          meeting_id: _id.toString()
        }
      );

      assert.containSubset(
        res.data[ 0 ].topics[ 0 ],
        {
          name: fakeMeeting.topics[ 0 ],
          meeting_id: _id.toString()
        }
      );
    });

  });

  describe( '#create', () => {

    it( 'should create meeting with participants and topics', async() => {
      const { data } = await client.post(
        '/meeting',
        fakeMeeting
      );

      assert.containSubset(
        data,
        {
          name: fakeMeeting.name,
          date: fakeMeeting.date.toISOString(),
          owner_id: fakeMeeting.owner_id
        }
      );

      assert.containSubset(
        data.participants[ 0 ],
        { email: fakeMeeting.participants[ 0 ] }
      );

      assert.containSubset(
        data.topics[ 0 ],
        { name: fakeMeeting.topics[ 0 ] }
      );
    });

  });

  describe( '#update', () => {

    it( 'should update a meetings participants and topics', async() => {
      const { _id } = await Meeting.create( fakeMeeting );

      await Participant.create({
        email: fakeMeeting.participants[ 0 ],
        meeting_id: _id
      });

      await Topic.create({
        name: fakeMeeting.topics[ 0 ],
        meeting_id: _id
      });

      const meetingUpdate = {
        _id: _id.toString(),
        owner_id: fakeMeeting.owner_id,
        name: 'meeting 2',
        date: '10/10/12'
      };

      const topicsUpdate = [
        {
          name: 'Topic 3',
          likes: [
            new ObjectID().toString()
          ]
        }
      ];

      const participantsUpdate = [
        {
          email: 'thudson@thudson.com'
        }
      ];

      const payload = {
        meeting: meetingUpdate,
        topics: topicsUpdate,
        participants: participantsUpdate
      };

      const { data } = await client.put(
        '/meeting',
        payload
      );

      assert.containSubset(
        data.meeting,
        meetingUpdate
      );

      assert.containSubset(
        data.topics[ 0 ],
        topicsUpdate[ 0 ]
      );

      assert.containSubset(
        data.participants[ 0 ],
        participantsUpdate[ 0 ]
      );
    });

  });

});
