const Meeting         = require('../../../lib/models/meeting');
const Participant     = require('../../../lib/models/participant');
const fakeMeeting     = require('../../fakes/meeting');
const fakeParticipant = require('../../fakes/participant');
const fakeUser        = require('../../fakes/user');
const { clean }       = require('../../utils/db');
const db              = require('../../../lib/db');
const { assert }      = require('chai');
const lib_rewire      = require('../../utils/lib-rewire');

const module_path = 'lib/util/authorization';

describe( module_path, () => {

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

    this.module = lib_rewire( module_path );
  });

  after( async() => {
    await db.disconnect();
  });


  describe( '#check_participant', () => {

    it( 'should return authorized if user is participant', async() => {
      const { authorized, meeting } = await this.module.check_participant(
        this.inserted_meeting._id,
        {
          user: fakeUser({ _id: 'someid', email: this.participants[ 0 ].email })
        }
      );

      assert.isTrue( authorized );
      assert.equal( meeting.name, this.inserted_meeting.name );
    });

    it( 'should return authorized if user is meeting owner', async() => {
      const { authorized, meeting } = await this.module.check_participant(
        this.inserted_meeting._id,
        { user: fakeUser({ _id: this.meeting.owner_id }) }
      );

      assert.isTrue( authorized );
      assert.equal( meeting.name, this.inserted_meeting.name );
    });

    it( 'should return authorized if participant is participant', async() => {
      const { authorized, meeting } = await this.module.check_participant(
        this.inserted_meeting._id,
        {
          participant: fakeParticipant({
            _id: this.participants[ 0 ]._id,
            meeting_id: this.inserted_meeting._id
          })
        }
      );

      assert.isTrue( authorized );
      assert.equal( meeting.name, this.inserted_meeting.name );
    });

    it( 'should return unauthorized if user is not participant', async() => {
      const { authorized, meeting } = await this.module.check_participant(
        this.inserted_meeting._id,
        { user: fakeUser({ _id: 'some_id', email: 'some_email' }) }
      );

      assert.isFalse( authorized );
      assert.notExists( meeting );
    });

    it( 'should return unauthorized if partic is not participant', async() => {
      const { authorized, meeting } = await this.module.check_participant(
        this.inserted_meeting._id,
        {
          participant: fakeParticipant({
            _id: this.participants[ 0 ]._id
          })
        }
      );

      assert.isFalse( authorized );
      assert.notExists( meeting );
    });

  });

  describe( '#check_owner', () => {

    it( 'should return authorized and doc if doc user is owner', async() => {
      const { authorized, document } = await this.module.check_owner(
        this.inserted_meeting._id,
        'meetings',
        { user: { _id: this.meeting.owner_id } }
      );

      assert.isTrue( authorized );
      assert.equal( this.inserted_meeting.name, document.name );
    });

    it( 'should return authorized and doc if doc participant is owner', async() => {
      const { authorized, document } = await this.module.check_owner(
        this.inserted_meeting._id,
        'meetings',
        { participant: { _id: this.meeting.owner_id } }
      );

      assert.isTrue( authorized );
      assert.equal( this.inserted_meeting.name, document.name );
    });

    it( 'should return unauthorized and no doc if not owner', async() => {
      const { authorized, document } = await this.module.check_owner(
        this.inserted_meeting._id,
        'meetings',
        { user: { _id: 'some_id' } }
      );

      assert.isFalse( authorized );
      assert.notExists( document );
    });

  });

  describe( '#check_user', () => {

    it( 'should return authorized if user', () => {
      const { authorized } = this.module.check_user({ usr: true });

      assert.isTrue( authorized );
    });

    it( 'should return unauthorized if not user', () => {
      const { authorized } = this.module.check_user();

      assert.isFalse( authorized );
    });

  });

});
