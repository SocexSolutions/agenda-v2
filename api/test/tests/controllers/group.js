const assert = require( "assert" );
const dbUtils = require( "../../utils/db" );
const db = require( "../../../lib/db" );
const api = require( "../../utils/api" );
const client = require( "../../utils/client" );
const ObjectID = require( "mongoose" ).Types.ObjectId;

const group = {
  owner_id: new ObjectID()
};

describe( "controllers/group", () => {
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

  describe( "#create", () => {
    const path = "/group/";

    it( "should create a group with valid inputs", async() => {
      const res = await client.post( path, group );

      assert( res.status === 201, "failed to create group with valid args" );

    });

    it( "should not create a group without id", async() => {
      const invalidGroup = { ...group, owner_id: "invalid_id" };
      const errorRegex = /^Group validation failed: owner_id/;

      try {
        await client.post( path, invalidGroup );

        throw new Error( "accepted invalid owner_id" );
      } catch ( err ) {
        assert(
          errorRegex.test( err.response.data ),
          "Error occurred for wrong reason: " + err
        );
      }
    });
  });

  describe( "#display", () => {

    it( "should fetch group with members", async() => {
      const groupRes = await client.post( "group/", group );

      const member = {
        username: "zach",
        password: "zach123",
        email:    "email"
      };

      const memberRes = await client.post( "member/", member );

      const res = await client.get( `group/${ groupRes.data._id }` );

      const aggregatedGroup = {
        ...groupRes.data,
        members: [ memberRes.data ]
      };

      assert.deepEqual(
        res.data[ 0 ],
        aggregatedGroup
      );
    });
  });
});
