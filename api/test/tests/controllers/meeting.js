const assert = require( "assert" );
const dbUtils = require( "../../utils/db" );
const db = require( "../../../lib/db" );
const api = require( "../../utils/api" );
const client = require( "../../utils/client" );
const ObjectID = require( "mongoose" ).Types.ObjectId;

const MEETING = {
  name: "Meeting 1",
  owner_id: new ObjectID(),
  date: "10/10/10"
};

const MEETING_2 = {
  name: "Meeting 2",
  owner_id: new ObjectID(),
  date: "10/12/10"
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
    it( "should fetch all meetings", async() => {
      const meetingRes = await client.post( "meeting/", MEETING );
      const meetingRes2 = await client.post( "meeting/", MEETING_2 );

      const meetings = await client.get( "meeting/", MEETING );

      assert.deepEqual( meetings.data, [ meetingRes.data, meetingRes2.data ] );
    });
  });

  describe( "#display", () => {
    it( "should fetch meeting with participants", async() => {
      const meetingRes = await client.post( "meeting/", MEETING );

      const participant = {
        email: "email@email.com",
        meeting_id: meetingRes.data._id
      };

      const participantRes = await client.post( "participant/", participant );

      const res = await client.get( `meeting/${meetingRes.data._id}` );

      const aggregatedMeeting = {
        ...meetingRes.data,
        participants: [ participantRes.data ],
        topics: [ ]
      };

      assert.deepEqual( res.data[0], aggregatedMeeting );
    });

    it( "should fetch meeting with topics", async() => {
      const meetingRes = await client.post( "meeting/", MEETING );

      const topic = {
        name: "Jazz",
        meeting_id: meetingRes.data._id
      };

      const topicRes = await client.post( "topic/", topic );

      const res = await client.get( `meeting/${meetingRes.data._id}` );

      const aggregatedMeeting = {
        ...meetingRes.data,
        topics: [ topicRes.data ],
        participants: [ ]
      };

      assert.deepEqual( res.data[0], aggregatedMeeting );
    });
  });

  describe( "#create", () => {
    const path = "/meeting/";

    it( "should create a meeting with valid inputs", async() => {
      const res = await client.post( path, MEETING );

      assert( res.status === 201, "failed to create meeting with valid args" );

      assert(
        res.data.date === MEETING.date,
        "created meeting with incorrect date: " + res.data.date
      );
    });

    it( "should not create a meeting without id", async() => {
      const invalidMeeting = { ...MEETING, owner_id: "invalid_id" };
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
      const invalidMeeting = { ...MEETING, date: "" };
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
      const invalidMeeting = { ...MEETING, date: "" };
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

  describe( "#update", async() => {
    const path = "/meeting/";

    it( "should update all meeting attributes", async() => {
      const createRes = await client.post( path, MEETING );

      const updateRes = await client.patch(
        path + createRes.data._id,
        MEETING_2
      );

      assert.equal( updateRes.data.name, MEETING_2.name );
      assert.equal( updateRes.data.date, MEETING_2.date );
      assert.equal( updateRes.data.owner_id, MEETING_2.owner_id.toString() );
      assert.equal( createRes.data._id, updateRes.data._id );
    });

    it( "should update some meeting attributes", async() => {
      const createRes = await client.post( path, MEETING );

      const update = { name: "First Geneva Convention" };

      const updateRes = await client.patch(
        path + createRes.data._id,
        update
      );

      assert.equal( updateRes.data.name, update.name );
      assert.equal( updateRes.data.date, createRes.data.date  );
    });
  });
});
