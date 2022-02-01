const { assert }  = require('chai');
const dbUtils     = require('../../utils/db');
const db          = require('../../../lib/db');
const api         = require('../../utils/api');
const ObjectID    = require('mongoose').Types.ObjectId;
const client      = require('../../utils/client');
const Meeting     = require('../../../lib/models/meeting');
const Participant = require('../../../lib/models/participant');

const meeting1 = {
  name: 'meeting1',
  owner_id: new ObjectID(),
  date: 'tues'
};

const meeting2 = {
  name: 'meeting2',
  owner_id: new ObjectID(),
  date: 'tuesdy'
};

const participant = {
  email: 'lt@linux.com',
  meeting_id: new ObjectID()
};

describe( 'controllers/participant', () => {
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
    const path = '/participant';

    it( 'should create a participant with valid inputs', async() => {
      const res = await client.post( path, participant );

      assert(
        res.status === 201,
        'failed to create participant with valid args'
      );

      assert(
        res.data.email === participant.email,
        'created participant with incorrect email'
      );
    });

    it( 'should not create a participant without email', async() => {
      const invalidParticipant = { ...participant, email: '' };
      const errorRegex = /^Participant validation failed: email/;

      try {
        await client.post( path, invalidParticipant );

        throw new Error('accepted invalid email');
      } catch ( err ) {
        assert(
          errorRegex.test( err.response.data.message ),
          JSON.stringify( err.response.data.message )
        );
      }
    });

    it( 'should not create a participant without meeting_id', async() => {
      const invalidParticipant = { ...participant, meeting_id: '' };
      const errorRegex = /^Participant validation failed: meeting_id/;

      try {
        await client.post( path, invalidParticipant );

        throw new Error('accepted invalid email');
      } catch ( err ) {
        assert(
          errorRegex.test( err.response.data.message ),
          JSON.stringify( err.response.data.message )
        );
      }
    });
  });

  describe( '#getMeetings', () => {

    it( 'should return meetings', async() => {
      const res = await Meeting.insertMany([ meeting1, meeting2 ]);

      const participants = [];

      res.forEach( ( meeting ) => {
        participants.push({ email: 'jack@aol.com', meeting_id: meeting._id });
      });

      await Participant.insertMany( participants );

      const { data } = await client.get('participant/meetings/jack@aol.com ');

      assert.strictEqual( data.length, 2 );
      assert.deepEqual( data[ 1 ].name, res[ 1 ].name );
    });

  });

});
