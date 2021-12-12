const assert   = require( "assert" );
const dbUtils  = require( "../../utils/db" );
const db       = require( "../../../lib/db" );
const api      = require( "../../utils/api" );
const ObjectID = require( "mongoose" ).Types.ObjectId;
const client   = require( "../../utils/client" );
const Meeting  = require( "../../../lib/models/meeting" );
const Participant  = require( "../../../lib/models/participant" );

const meeting1 = {
  name: "meeting1",
  owner_id: new ObjectID(),
  date: "tues"
};

const meeting2 = {
  name: "meeting2",
  owner_id: new ObjectID(),
  date: "tuesdy"
};

const participant = {
  email: "lt@linux.com",
  meeting_id: new ObjectID(),
};

describe( "controllers/participant", () => {
  before( async() => {
    await api.start();
    await db.connect();
    await dbUtils.clean();
  });

  afterEach( async() => {
    await dbUtils.clean();
  });

  after( async() => {
    await api.stop();
    await db.disconnect();
  });

  describe( "#create", () => {
    const path = "/participant";

    it( "should create a participant with valid inputs", async() => {
      const res = await client.post( path, participant );

      assert(
        res.status === 201,
        "failed to create participant with valid args"
      );

      assert(
        res.data.email === participant.email,
        "created participant with incorrect email"
      );
    });

    it( "should not create a participant without email", async() => {
      const invalidParticipant = { ...participant, email: "" };
      const errorRegex = /^Participant validation failed: email/;

      try {
        await client.post( path, invalidParticipant );

        throw new Error( "accepted invalid email" );
      } catch ( err ) {
        assert(
          errorRegex.test( err.response.data.message ),
          JSON.stringify( err.response.data.message )
        );
      }
    });

    it( "should not create a participant without meeting_id", async() => {
      const invalidParticipant = { ...participant, meeting_id: "" };
      const errorRegex = /^Participant validation failed: meeting_id/;

      try {
        await client.post( path, invalidParticipant );

        throw new Error( "accepted invalid email" );
      } catch ( err ) {
        assert(
          errorRegex.test( err.response.data.message ),
          JSON.stringify( err.response.data.message )
        );
      }
    });
  });
  describe.only( "#getMeetings", () => {
    it( "should return meetings", async() => {

      const res = await Meeting.insertMany( [ meeting1, meeting2 ] );

      let participants = new Array();

      res.forEach( ( meeting ) => {
        participants.push(
          { email: "jack@aol.com", meeting_id: meeting._id }
        );
      });

      const res2 = await Participant.insertMany( participants );

      try{
        console.log( "posting..." );
        await client.post( "participant/getmeetings", { email: "jack@aol.com" });
      }
      catch ( err ) {
        console.log( err.response );
      }
    });
  });
});
