const Meeting          = require('../../../lib/models/meeting');
const Participant      = require('../../../lib/models/participant');
const checkParticipant = require('../../../lib/auth/check-participant');
const fakeMeeting      = require('../../fakes/meeting');
const fakeParticipant  = require('../../fakes/participant');
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

    it( 'should succeed if participant exists', async() => {
      const participant_found = await checkParticipant(
        this.inserted_meeting._id,
        this.participants[ 0 ].email
      );

      assert.isTrue( participant_found );
    });

    it( 'should return false if participant does not exist', async() => {
      const participant_found = await checkParticipant(
        this.inserted_meeting._id,
        'brian@brian.com'
      );

      assert.isFalse( participant_found );
    });

  });

});
