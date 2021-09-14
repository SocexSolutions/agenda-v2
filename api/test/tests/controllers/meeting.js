const assert = require( "assert" );
const dbUtils = require( "../../utils/db" );
const db = require( "../../../lib/db" );
const api = require( "../../utils/api" );
const client = require( "../../utils/client" );
const ObjectID = require( "mongoose" ).Types.ObjectId;

const meeting = {
  owner_id: new ObjectID(),
  date: "10/10/10",
};

const meeting2 = {
  owner_id: new ObjectID(),
  date: "10/12/10",
};

describe( "controllers/meeting", () => {
  before( async() => {
    await api.start();
    await db.connect();
    await dbUtils.clean();
  });

  after( async() => {
    await api.stop();
    await db.disconnect();
  });

  afterEach( async() => {
    await dbUtils.clean();
  });

  describe( "#index", () => {
    it.only( "should fetch meeting with particpant", async() => {
      const meetingRes = await client.post( "meeting/", meeting );
      const meetingRes2 = await client.post( "meeting/", meeting2 );

      const meetings = await client.get( "meeting/", meeting );

      assert.deepEqual( meetings.data, [ meetingRes.data, meetingRes2.data ] );
    });
  });

  describe( "#display", () => {
    it( "should fetch meeting with participants", async() => {
      const meetingRes = await client.post( "meeting/", meeting );

      const participant = {
        email: "email@email.com",
        meeting_id: meetingRes.data._id,
      };

      const participantRes = await client.post( "participant/", participant );

      const res = await client.get( `meeting/${meetingRes.data._id}` );

      const aggregatedMeeting = {
        ...meetingRes.data,
        participants: [ participantRes.data ],
      };

      assert.deepEqual( res.data[0], aggregatedMeeting );
    });
  });

  describe( "#create", () => {
    const path = "/meeting/";

    it( "should create a meeting with valid inputs", async() => {
      const res = await client.post( path, meeting );

      assert( res.status === 201, "failed to create meeting with valid args" );

      assert(
        res.data.date === meeting.date,
        "created meeting with incorrect date: " + res.data.date
      );
    });

    it( "should not create a meeting without id", async() => {
      const invalidMeeting = { ...meeting, owner_id: "invalid_id" };
      const errorRegex = /^Meeting validation failed: owner_id/;

      try {
        await client.post( path, invalidMeeting );

        throw new Error( "accepted invalid owner_id" );
      } catch ( err ) {
        assert(
          errorRegex.test( err.response.data ),
          "Error occurred for wrong reason: " + err
        );
      }
    });

    it( "should not create a meeting without date", async() => {
      const invalidMeeting = { ...meeting, date: "" };
      const errorRegex = /^Meeting validation failed: date/;

      try {
        await client.post( path, invalidMeeting );

        throw new Error( "accepted invalid owner_id" );
      } catch ( err ) {
        assert(
          errorRegex.test( err.response.data ),
          "Error occurred for wrong reason: " + err
        );
      }
    });

    it( "should not create a meeting without date", async() => {
      const invalidMeeting = { ...meeting, date: "" };
      const errorRegex = /^Meeting validation failed: date/;

      try {
        await client.post( path, invalidMeeting );

        throw new Error( "accepted invalid owner_id" );
      } catch ( err ) {
        assert(
          errorRegex.test( err.response.data ),
          "Error occurred for wrong reason: " + err
        );
      }
    });
  });
});
