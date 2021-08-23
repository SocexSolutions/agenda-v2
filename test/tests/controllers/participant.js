const assert       = require( "assert" );
const dbUtils      = require( "../../utils/db" );
const db           = require( "../../../lib/db" );
const ObjectID     = require( "mongoose" ).Types.ObjectId;
const axios        = require( "axios" );

const participant = {
  firstName: "linus",
  lastName: "torvalds",
  email: "lt@linux.com",
  meeting_id: new ObjectID
};

describe.only( "controllers/participant", () => {

  before( async() => {
    await db.connect();
  });

  beforeEach( async() => {
    await dbUtils.clean();
  });

  after( async() => {
    await db.disconnect();
  });

  describe( "#create", () => {
    const path = "http://localhost:5000/participant/create";

    it( "should create a participant with valid inputs", async() => {
      const res = await axios.post( path, participant );

      assert(
        res.status === 200,
        "failed to create participant with valid args"
      );
    });

    it( "should not create a participant without email", async() => {
      const invalidParticipant = { ...participant, email: "" };

      try {
        await axios.post( path, invalidParticipant );

        throw new Error( "accepted invalid email" );

      } catch ( err ) { }
    });

    it( "should not create a participant without firstname", async() => {
      const invalidParticipant = { ...participant, firstName: "" };

      try {
        await axios.post( path, invalidParticipant );

        throw new Error( "accepted invalid firstname" );

      } catch ( err ) { }
    });

    it( "should not create a participant without lastname", async() => {
      const invalidParticipant = { ...participant, lastname: "" };

      try {
        await axios.post( path, invalidParticipant );

        throw new Error( "accepted empty last name" );

      } catch ( err ) { }
    });

  });

});