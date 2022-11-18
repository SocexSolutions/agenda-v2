const chai = require("chai");
const dbUtils = require("../../utils/db");
const db = require("../../../lib/db");
const api = require("../../utils/api");
const client = require("../../utils/client");
const Group = require("../../../lib/models/group");
const Tag = require("../../../lib/models/tag");
const User = require("../../../lib/models/user");
const fakeRegister = require("../../fakes/register");
const fakeGroup = require("../../fakes/group");

const assert = chai.assert;

describe("lib/controllers/tag", () => {
  let groupOwner;
  let group;
  let groupMember;
  let nonMember;

  before(async () => {
    await api.start();
    await db.connect();
  });

  beforeEach(async () => {
    await dbUtils.clean();

    const res = await client.post("/user/register", fakeRegister());
    groupOwner = res.data.user;
    groupOwner.token = res.data.access_token;

    const res2 = await client.post("/user/register", fakeRegister());
    groupMember = res2.data.user;
    groupMember.token = res2.data.access_token;

    const res3 = await client.post("/user/register", fakeRegister());

    nonMember = res3.data.user;
    nonMember.token = res3.data.access_token;

    group = await Group.create(fakeGroup({ owner_ids: [groupOwner._id] }));

    await User.findByIdAndUpdate(groupMember._id, { groups: [group._id] });
  });

  after(async () => {
    await dbUtils.clean();
    await api.stop();
    await db.disconnect();
  });

  describe("create", () => {
    it("should create a new tag if the user is the owner of the group", async () => {
      const res = await client.post(
        "/tag",
        {
          name: "group owner tag",
          color: "red",
          group_id: group._id,
        },
        {
          headers: { Authorization: groupOwner.token },
        }
      );

      assert.equal(res.status, 201);
      assert.equal(res.data.name, "group owner tag");
      assert.equal(res.data.group_id, group._id);
    });

    it("should create a new tag if the user is a member of the group", async () => {
      const res = await client.post(
        "/tag",
        {
          name: "group member tag",
          color: "red",
          group_id: group._id,
        },
        {
          headers: { Authorization: groupMember.token },
        }
      );

      assert.equal(res.status, 201);
      assert.equal(res.data.name, "group member tag");
      assert.equal(res.data.group_id, group._id);
    });

    it("should not create a new tag if the user is not a member of the group", async () => {
      try {
        await client.post(
          "/tag",
          {
            name: "test",
            group_id: group._id,
          },
          {
            headers: { Authorization: nonMember.token },
          }
        );
        assert.fail("should have thrown");
      } catch (err) {
        assert.equal(err.response.status, 403);
      }
    });

    it("should not create a tag if one already exists", async () => {
      await Tag.create({
        group_id: group._id,
        name: "test",
      });

      try {
        await client.post(
          "/tag",
          {
            name: "test",
            group_id: group._id,
          },
          {
            headers: { Authorization: groupOwner.token },
          }
        );
      } catch (err) {
        assert.equal(err.response.status, 400);
      }
    });
  });
});
