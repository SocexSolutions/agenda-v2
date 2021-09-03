const assert   = require( "assert" );
const dbUtils  = require( "../../utils/db" );
const db       = require( "../../../lib/db" );
const api      = require( "../../utils/api" );
const ObjectID = require( "mongoose" ).Types.ObjectId;
const axios    = require( "axios" );

const meeting = {
  owner_id: new ObjectID,
  date: "1"
};


describe.only( "controllers/meeting", () => {

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
    const path = "http://localhost:5000/meeting/create";

    it( "should create a meeting with valid inputs", async() => {
      const res = await axios.post( path, meeting );

      assert(
        res.status === 201,
        "failed to create meeting with valid args"
      );
    });

    it( "should not create a meeting without id", async() => {
      const invalidMeeting = { ...meeting, owner_id: "" };

      try {
        await axios.post( path, invalidMeeting );

        throw new Error( "accepted invalid ownder_id" );

      } catch ( err ) { }
    });

    it( "should not create a meeting without date", async() => {
      const invalidMeeting = { ...meeting, date: "" };

      try {
        await axios.post( path, invalidMeeting );

        throw new Error( "accepted invalid date" );

      } catch ( err ) { }
    });

  });

});
