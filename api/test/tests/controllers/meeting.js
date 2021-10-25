const chai        = require( "chai" );
const chaiSubset  = require( "chai-subset" );
const dbUtils     = require( "../../utils/db" );
const db          = require( "../../../lib/db" );
const api         = require( "../../utils/api" );
const client      = require( "../../utils/client" );
const ObjectID    = require( "mongoose" ).Types.ObjectId;
const Meeting     = require( "../../../lib/models/meeting" );
const Participant = require( "../../../lib/models/participant" );
const Topic       = require( "../../../lib/models/topic" );

chai.use( chaiSubset );

const assert = chai.assert;


const fakeMeeting = {
  name:     "Meeting 1",
  owner_id: new ObjectID().toString(),
  date:     "10/10/10"
};

const fakeParticipant = {
  email: "thudson@thudson.thud"
};

const fakeTopic = {
  name:  "Topic 1",
  likes: [ ]
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
      Meeting.create( fakeMeeting );
      Meeting.create( fakeMeeting );

      const meetings = await client.get( "/meeting/" );

      assert.containSubset(
        meetings.data[0],
        fakeMeeting
      );

      assert.containSubset(
        meetings.data[1],
        fakeMeeting
      );
    });

  });

  describe( "#display", () => {

    it( "should fetch meeting with participants and topics", async() => {
      const { _id } = await Meeting.create( fakeMeeting );

      await Participant.create({
        ...fakeParticipant,
        meeting_id: _id
      });

      await Topic.create({
        ...fakeTopic,
        meeting_id: _id
      });

      const res = await client.get( `/meeting/${_id}` );

      assert.containSubset(
        res.data[0],
        fakeMeeting
      );

      assert.containSubset(
        res.data[0].participants[0],
        fakeParticipant
      );

      assert.containSubset(
        res.data[0].topics[0],
        fakeTopic
      );
    });

  });

  describe( "#create", () => {

    it( "should create meeting with participants and topics", async() => {
      const meeting = {
        ...fakeMeeting,
        participants: [ fakeParticipant ],
        topics: [ fakeTopic ]
      };

      const { data } = await client.post(
        "/meeting",
        meeting
      );

      assert.containSubset(
        data._doc,
        fakeMeeting
      );

      assert.containSubset(
        data.topics[0],
        fakeTopic
      );

      assert.containSubset(
        data.participants[0],
        fakeParticipant
      );

      const savedMeeting = await Meeting.find({ _id: data._doc._id });
      const topics       = await Topic.find({ meeting_id: data._doc._id });
      const participants = await Participant.find({
        meeting_id: data._doc._id
      });

      assert.containSubset(
        {
          ...savedMeeting[0]._doc,
          owner_id: savedMeeting[0]._doc.owner_id.toString()
        },
        fakeMeeting
      );

      assert.containSubset(
        participants[0]._doc,
        fakeParticipant
      );

      assert.containSubset(
        topics[0]._doc,
        fakeTopic
      );

    });

  });

});
