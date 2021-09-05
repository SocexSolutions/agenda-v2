const assert   = require( "assert" );
const dbUtils  = require( "../../utils/db" );
const db       = require( "../../../lib/db" );
const api      = require( "../../utils/api" );
const client   = require( "../../utils/client" );

describe( "controllers/meeting", () => {

  let meeting;

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

    meeting = {
      owner_id: data.user._id,
      date: "10/10/10",
      participants: [
        "brian@socnet.com",
        "herman@socnet.com"
      ]
    };
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

    it( "should create a meeting with valid inputs", async() => {
      const res = await client.post( path, meeting );

      assert(
        res.status === 201,
        "failed to create meeting with valid args"
      );

      assert(
        res.data.date === meeting.date,
        "created meeting with incorrect date: " + res.data.date
      );
    });

    it( "should not create a meeting without id", async() => {
      const invalidMeeting = { ...meeting, owner_id: "invalid_id" };
      const errorRegex     = /^Meeting validation failed: owner_id/;

      try {
        await client.post( path, invalidMeeting );

        throw new Error( "accepted invalid owner_id" );

      } catch ( err ) {

        assert(
          errorRegex.test( err.response.data ),
          "Error occured for wrong reason: " + err
        );
      }
    });

    it( "should not create a meeting without date", async() => {
      const invalidMeeting = { ...meeting, date: "" };
      const errorRegex     = /^Meeting validation failed: date/;

      try {
        await client.post( path, invalidMeeting );

        throw new Error( "accepted invalid owner_id" );

      } catch ( err ) {

        assert(
          errorRegex.test( err.response.data ),
          "Error occured for wrong reason: " + err
        );
      }
    });

    it( "should not create a meeting without date", async() => {
      const invalidMeeting = { ...meeting, date: "" };
      const errorRegex     = /^Meeting validation failed: date/;

      try {
        await client.post( path, invalidMeeting );

        throw new Error( "accepted invalid owner_id" );

      } catch ( err ) {

        assert(
          errorRegex.test( err.response.data ),
          "Error occured for wrong reason: " + err
        );
      }
    });

  });

});
