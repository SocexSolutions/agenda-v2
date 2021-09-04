const assert   = require( "assert" );
const dbUtils  = require( "../../utils/db" );
const db       = require( "../../../lib/db" );
const api      = require( "../../utils/api" );
const client   = require( "../../utils/client" );
const ObjectId = require( "mongoose" ).Types.ObjectId;


let owner_id;

describe.only( "controllers/meeting", () => {

  before( async() => {
    await api.start();
    await db.connect();

    const { data } = await client.post(
      "/user/register",
      {
        username: "tom",
        password: "pass",
        email:    "thudson@starry.com"
      }
    );

    owner_id = new ObjectId( data.user._id );
  });

  beforeEach( async() => {
    await dbUtils.clean();
  });

  after( async() => {
    await api.stop();
    await db.disconnect();
  });

  describe( "#create", () => {
    const path = "/meeting/create";

    const meeting = {
      owner_id,
      participants: [],
      date: "1"
    };

    it( "should create a meeting with valid inputs", async() => {
      const res = await client.post( path, meeting );

      assert(
        res.status === 201,
        "failed to create meeting with valid args"
      );
    });

    it( "should not create a meeting without id", async() => {
      const invalidMeeting = { ...meeting, owner_id: "" };

      try {
        await client.post( path, invalidMeeting );

        throw new Error( "accepted invalid ownder_id" );

      } catch ( err ) {

        console.log( err.message );
      }
    });

    it( "should not create a meeting without date", async() => {
      const invalidMeeting = { ...meeting, date: "" };

      const res = await client.post( path, invalidMeeting );

      console.log( res.status );
    });

  });

});
