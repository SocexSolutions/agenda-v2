const chai = require("chai");
const dbUtils = require("../../utils/db");
const db = require("../../../lib/db");
const api = require("../../utils/api");
const client = require("../../utils/client");
const Group = require("../../../lib/models/group");
const fakeUser = require("../../fakes/user");

const assert = chai.assert;

describe("lib/controllers/group", () => {
  let user;
  let user2;

  before(async () => {
    await api.start();
    await db.connect();
    await dbUtils.clean();

    const res = await client.post("/user/register", {
      username: "user",
      password: "pass",
      email: "brian@user.com",
    });
    user = res.data.user;
    user.token = res.data.access_token;

    const res2 = await client.post(
      "/user/register",
      fakeUser({
        username: "user2",
        password: "pass2",
        email: "user2@user.com",
      })
    );
    user2 = res2.data.user;
    user2.token = res2.data.access_token;
  });

  after(async () => {
    await api.stop();
    await dbUtils.clean();
    await db.disconnect();
  });

  describe("create", () => {
    it("should create a new group", async () => {
      const res = await client.post(
        "/group",
        {
          name: "test",
        },
        {
          headers: { Authorization: user.token },
        }
      );

      assert.equal(res.status, 201);
      assert.equal(res.data.name, "test");
      assert.equal(res.data.owner_ids[0], user._id);
    });
  });

  describe("update", () => {
    it("should update a group", async () => {
      const group = await Group.create({
        name: "test",
        owner_ids: [user._id],
      });

      const res = await client.patch(
        `/group/${group._id}`,
        {
          name: "test2",
        },
        {
          headers: { Authorization: user.token },
        }
      );

      assert.equal(res.status, 200);
      assert.equal(res.data.name, "test2");
    });

    it("should not update a group if not owner", async () => {
      const group = await Group.create({
        name: "test",
        owner_ids: [user._id],
      });

      try {
        await client.patch(
          `/group/${group._id}`,
          {
            name: "test2",
          },
          {
            headers: { Authorization: user2.token },
          }
        );

        assert.fail("should not have updated group");
      } catch (err) {
        assert.equal(err.response.status, 403);
      }
    });
  });
});
