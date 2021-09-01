const assert   = require( "assert" );
const dbUtils  = require( "../../utils/db" );
const db       = require( "../../../lib/db" );
const api      = require( "../../utils/api" );
const axios    = require( "axios" );

const meeting = {
  _id: "1"
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

    it( "should not create a meeting without email", async() => {
      const invalidMeeting = { ...meeting, _id: "" };

      try {
        await axios.post( path, invalidMeeting );

        throw new Error( "accepted invalid email" );

      } catch ( err ) { }
    });

  });

});