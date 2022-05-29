const Meeting          = require('../../../lib/models/meeting');
const Participant      = require('../../../lib/models/participant');
const checkParticipant = require('../../../lib/auth/check-participant');
const fakeMeeting      = require('../../fakes/meeting');
const fakeParticipant  = require('../../fakes/participant');
const fakeUser         = require('../../fakes/user');
const { clean }        = require('../../utils/db');
const db               = require('../../../lib/db');
const { assert }       = require('chai');

describe( 'lib/auth/check-participant', () => {

  describe( '#checkParticipant', () => {

    beforeEach( async() => {
      await db.connect();
      await clean();

      this.meeting          = fakeMeeting();
      this.inserted_meeting = await Meeting.create( this.meeting );

      this.participants = Array.from({ length: 3 }).map( () => {
        return fakeParticipant({ meeting_id: this.inserted_meeting._id });
      });

      this.inserted_participants = await Participant.insertMany(
        this.participants
      );
    });

    after( async() => {
      await db.disconnect();
    });

    it( 'should return authorized if meeting participant', async() => {
      const { authorized, meeting } = await checkParticipant(
        this.inserted_meeting._id,
        fakeUser({ _id: 'someid', email: this.participants[ 0 ].email })
      );

      assert.isTrue( authorized );
      assert.equal( meeting.name, this.inserted_meeting.name );
    });

    it( 'should return authorized if meeting owner', async() => {
      const { authorized, meeting } = await checkParticipant(
        this.inserted_meeting._id,
        fakeUser({ _id: this.meeting.owner_id })
      );

      assert.isTrue( authorized );
      assert.equal( meeting.name, this.inserted_meeting.name );
    });

    it( 'should return unauthorized if not participant', async() => {
      const { authorized } = await checkParticipant(
        this.inserted_meeting._id,
        fakeUser({ _id: 'some_id', email: 'some_email' })
      );

      assert.isFalse( authorized );
    });

  });

});
