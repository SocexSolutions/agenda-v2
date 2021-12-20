const assert   = require('assert');
const dbUtils  = require('../../utils/db');
const db       = require('../../../lib/db');
const api      = require('../../utils/api');
const client   = require('../../utils/client');
const ObjectID = require('mongoose').Types.ObjectId;

const topic = {
  name: 'topic name',
  meeting_id: new ObjectID(),
  likes: [ new ObjectID(), new ObjectID() ]
};

describe( 'api/lib/controllers/topic', () => {

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

  describe( '#create', () => {
    const path = '/topic';

    it( 'should create topic with valid inputs', async() => {
      const res = await client.post( path, topic );

      assert( res.status === 201, 'failed to create topic with valid inputs' );

      assert(
        res.data.name === topic.name,
        'created topic with incorrect name: ' + res.data.name
      );
    });

    it( 'should create topic without likes', async() => {
      const topicWithoutParticipants = { ...topic, likes: [] };

      const res = await client.post( path, topicWithoutParticipants );

      assert( res.status === 201, 'failed to create topic without likes' );

      assert(
        res.data.likes.length === 0,
        'created topic with incorrect likes: ' + res.data.likes
      );
    });

    it( 'should not create topic without name', async() => {
      const topicWithoutName = { ...topic, name: '' };
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
    });

    it( 'should not create topic without meeting_id', async() => {
      const topicWithoutMeetingId = { ...topic, meeting_id: '' };
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
    });

  });

});
