const chai       = require( "chai" );
const chaiSubset = require( "chai-subset" );
const dbUtils    = require( "../../utils/db" );
const db         = require( "../../../lib/db" );
const api        = require( "../../utils/api" );
const client     = require( "../../utils/client" );
const ObjectID   = require( "mongoose" ).Types.ObjectId;

chai.use( chaiSubset );

const assert = chai.assert;

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

const PARTICIPANTS = [ "zbarnz@yahoo.com", "thudson1998@hotmail.com" ];

const PARTICIPANTS_2 = [ "zbarnz@socnet.org", "thudson1998@yahoo.com" ];

const TOPICS = [ "LUNCH", "math", "2984@" ];

const TOPICS_2 = [ "Food", "English", "1783@" ];

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
    const path = "/meeting";

    it( "should create a new meeting", async() => {
      const payload = {
        meeting: MEETING,
        participants: PARTICIPANTS,
        topics: TOPICS
      };

      const res = await client.post(
        path,
        payload
      );

      assert.containSubset(
        res.data.meeting,
        { name: MEETING.name, date: MEETING.date }
      );

      for ( let i = 0; i < PARTICIPANTS.length; i++ ) {
        assert.containSubset(
          res.data.participants[i], { email: PARTICIPANTS[i] }
        );
      }

      for ( let i = 0; i < TOPICS.length; i++ ) {
        assert.containSubset(
          res.data.topics[i], { name: TOPICS[i] }
        );
      }
    });

    it( "should update an existing meeting", async() => {
      const payload = {
        meeting: MEETING,
        participants: PARTICIPANTS,
        topics: TOPICS
      };

      const res = await client.post(
        path,
        payload
      );

      const meeting_id = res.data.meeting._id;

      MEETING_2._id = meeting_id;

      const payload2 = {
        meeting: MEETING_2,
        participants: PARTICIPANTS_2,
        topics: TOPICS_2
      };

      const secondRes = await client.post(
        path,
        payload2
      );

      assert.containSubset(
        secondRes.data.meeting,
        { name: MEETING_2.name, date: MEETING_2.date, _id: meeting_id }
      );

      for ( let i = 0; i < PARTICIPANTS_2.length; i++ ) {
        assert.containSubset(
          secondRes.data.participants[i], { email: PARTICIPANTS_2[i] }
        );
      }

      for ( let i = 0; i < TOPICS_2.length; i++ ) {
        assert.containSubset(
          secondRes.data.topics[i], { name: TOPICS_2[i] }
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
