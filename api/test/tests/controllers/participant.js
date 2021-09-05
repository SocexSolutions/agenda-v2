const assert = require( "assert" );
const dbUtils = require( "../../utils/db" );
const db = require( "../../../lib/db" );
const api = require( "../../utils/api" );
const ObjectID = require( "mongoose" ).Types.ObjectId;
const client = require( "../../utils/client" );

const participant = {
  email: "lt@linux.com",
  meeting_id: new ObjectID(),
};

describe( "controllers/participant", () => {
  before( async() => {
    await api.start();
    await db.connect();
  });

  beforeEach( async() => {
    await dbUtils.clean();
  });

  after( async() => {
    await api.stop();
    await db.disconnect();
  });

  describe( "#create", () => {
    const path = "/participant/create";

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
          errorRegex.test( err.response.data ),
          "Error occured for the wrong reason: " + err
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
          errorRegex.test( err.response.data ),
          "Error occured for the wrong reason: " + err
        );
      }
    });
  });
});
