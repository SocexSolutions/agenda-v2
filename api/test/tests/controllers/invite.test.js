const chai = require("chai");
const dbUtils = require("../../utils/db");
const db = require("../../../lib/db");
const api = require("../../utils/api");
const client = require("../../utils/client");
const fakeUser = require("../../fakes/user");
const Group = require("../../../lib/models/group");
const User = require("../../../lib/models/user");
const Invite = require("../../../lib/models/invite");

const assert = chai.assert;

describe("lib/controllers/invite", () => {
  let user;
  let user2;
  let group;

  before(async () => {
    await api.start();
    await db.connect();
  });

  beforeEach(async () => {
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

    group = await Group.create({
      name: "group",
      owner_ids: [user._id],
    });
  });

  after(async () => {
    await api.stop();
    await dbUtils.clean();
    await db.disconnect();
  });

  describe("create", () => {
    it("should create a new invite", async () => {
      const res = await client.post(
        "/invite",
        {
          invitee: user2._id,
          group_id: group._id,
        },
        {
          headers: { Authorization: user.token },
        }
      );

      assert.equal(res.status, 201);
      assert.equal(res.data.invitee, user2._id);
      assert.equal(res.data.owner_id, user._id);
    });

    it("should not create an invite if the invitee does not exist", async () => {
      try {
        await client.post(
          "/invite",
          {
            invitee: "5f6a5e6c1d6e9b1c8b6e4d4c",
            group_id: group._id,
          },
          {
            headers: { Authorization: user.token },
          }
        );

        assert.fail("Should have thrown an error");
      } catch (err) {
        assert.equal(err.response.status, 400);
        assert.equal(err.response.data.message, "Invitee not found");
      }
    });

    it("should not create an invite if the group does not exist", async () => {
      try {
        await client.post(
          "/invite",
          {
            invitee: user2._id,
            group_id: "5f6a5e6c1d6e9b1c8b6e4d4c",
          },
          {
            headers: { Authorization: user.token },
          }
        );

        assert.fail("Should have thrown an error");
      } catch (err) {
        assert.equal(err.response.status, 403);
      }
    });

    it("should not create an invite if the user is not the owner of the group", async () => {
      try {
        await client.post(
          "/invite",
          {
            invitee: user2._id,
            group_id: group._id,
          },
          {
            headers: { Authorization: user2.token },
          }
        );

        assert.fail("Should have thrown an error");
      } catch (err) {
        assert.equal(err.response.status, 403);
      }
    });

    it("should not create an invite if an invite already exists", async () => {
      await Invite.create({
        owner_id: user._id,
        invitee: user2._id,
        group_id: group._id,
        status: "open",
      });

      try {
        await client.post(
          "/invite",
          {
            invitee: user2._id,
            group_id: group._id,
          },
          {
            headers: { Authorization: user.token },
          }
        );

        assert.fail("Should have thrown an error");
      } catch (err) {
        assert.equal(err.response.status, 400);
        assert.equal(err.response.data.message, "User already invited");
      }
    });
  });

  describe("cancel", () => {
    it("should cancel an invite", async () => {
      const invite = await Invite.create({
        owner_id: user._id,
        invitee: user2._id,
        group_id: group._id,
        status: "open",
      });

      const res = await client.patch(
        `/invite/${invite._id}/cancel`,
        {},
        {
          headers: { Authorization: user.token },
        }
      );

      assert.equal(res.status, 200);
      assert.equal(res.data.status, "cancelled");

      const updatedInvite = await Invite.findById(invite._id);

      assert.equal(updatedInvite.status, "cancelled");
    });

    it("should not cancel an invite if the invite does not exist", async () => {
      try {
        await client.patch(
          `/invite/5f6a5e6c1d6e9b1c8b6e4d4c/cancel`,
          {},
          {
            headers: { Authorization: user.token },
          }
        );

        assert.fail("Should have thrown an error");
      } catch (err) {
        assert.equal(err.response.status, 404);
      }
    });

    it("should not cancel an invite if the user is not the owner of the invite", async () => {
      const invite = await Invite.create({
        owner_id: user._id,
        invitee: user2._id,
        group_id: group._id,
        status: "open",
      });

      try {
        await client.patch(
          `/invite/${invite._id}/cancel`,
          {},
          {
            headers: { Authorization: user2.token },
          }
        );

        assert.fail("Should have thrown an error");
      } catch (err) {
        assert.equal(err.response.status, 403);
      }
    });

    it("should not cancel an invite if the invite is already cancelled", async () => {
      const invite = await Invite.create({
        owner_id: user._id,
        invitee: user2._id,
        group_id: group._id,
        status: "cancelled",
      });

      try {
        await client.patch(
          `/invite/${invite._id}/cancel`,
          {},
          {
            headers: { Authorization: user.token },
          }
        );

        assert.fail("Should have thrown an error");
      } catch (err) {
        assert.equal(err.response.status, 400);
        assert.equal(err.response.data.message, "Invite was already cancelled");
      }
    });

    it("should not cancel an invite if the invite has been responded to", async () => {
      const invite = await Invite.create({
        owner_id: user._id,
        invitee: user2._id,
        group_id: group._id,
        status: "accepted",
      });

      try {
        await client.patch(
          `/invite/${invite._id}/cancel`,
          {},
          {
            headers: { Authorization: user.token },
          }
        );

        assert.fail("Should have thrown an error");
      } catch (err) {
        assert.equal(err.response.status, 400);
        assert.equal(
          err.response.data.message,
          "Invite was already responded to"
        );
      }
    });
  });

  describe("respond", () => {
    it("should accept an an invite", async () => {
      const invite = await Invite.create({
        owner_id: user._id,
        invitee: user2._id,
        group_id: group._id,
        status: "open",
      });

      const res = await client.patch(
        `/invite/${invite._id}/respond`,
        {
          status: "accepted",
        },
        {
          headers: { Authorization: user2.token },
        }
      );

      assert.equal(res.status, 200);
      assert.equal(res.data.status, "accepted");

      const updatedInvite = await Invite.findById(invite._id);

      assert.equal(updatedInvite.status, "accepted");

      const updatedUser = await User.findById(user2._id);

      assert.ok(updatedUser.groups.includes(group._id));
    });

    it("should reject an invite", async () => {
      const invite = await Invite.create({
        owner_id: user._id,
        invitee: user2._id,
        group_id: group._id,
        status: "open",
      });

      const res = await client.patch(
        `/invite/${invite._id}/respond`,
        {
          status: "rejected",
        },
        {
          headers: { Authorization: user2.token },
        }
      );

      assert.equal(res.status, 200);
      assert.equal(res.data.status, "rejected");

      const updatedInvite = await Invite.findById(invite._id);

      assert.equal(updatedInvite.status, "rejected");

      const updatedUser = await User.findById(user2._id);

      assert.equal(updatedUser.groups.length, 0);
    });

    it("should not respond to an invite if the invite does not exist", async () => {
      try {
        await client.patch(
          `/invite/5f6a5e6c1d6e9b1c8b6e4d4c/respond`,
          {
            status: "accepted",
          },
          {
            headers: { Authorization: user2.token },
          }
        );

        assert.fail("Should have thrown an error");
      } catch (err) {
        assert.equal(err.response.status, 404);
      }
    });

    it("should not respond to an invite if the user is not the invitee of the invite", async () => {
      const invite = await Invite.create({
        owner_id: user._id,
        invitee: user2._id,
        group_id: group._id,
        status: "open",
      });

      try {
        await client.patch(
          `/invite/${invite._id}/respond`,
          {
            status: "accepted",
          },
          {
            headers: { Authorization: user.token },
          }
        );

        assert.fail("Should have thrown an error");
      } catch (err) {
        assert.equal(err.response.status, 401);
      }

      const updatedUser = await User.findById(user2._id);

      assert.equal(updatedUser.groups.length, 0);
    });

    it("should not respond to an invite if the status is accepted or rejected", async () => {
      const invite = await Invite.create({
        owner_id: user._id,
        invitee: user2._id,
        group_id: group._id,
        status: "rejected",
      });

      try {
        await client.patch(
          `/invite/${invite._id}/respond`,
          {
            status: "accepted",
          },
          {
            headers: { Authorization: user2.token },
          }
        );

        assert.fail("Should have thrown an error");
      } catch (err) {
        assert.equal(err.response.status, 400);
        assert.equal(
          err.response.data.message,
          "Invite was already responded to"
        );
      }

      const updatedUser = await User.findById(user2._id);

      assert.equal(updatedUser.groups.length, 0);
    });

    it("should not respond to an invite if the status is cancelled", async () => {
      const invite = await Invite.create({
        owner_id: user._id,
        invitee: user2._id,
        group_id: group._id,
        status: "cancelled",
      });

      try {
        await client.patch(
          `/invite/${invite._id}/respond`,
          {
            status: "accepted",
          },
          {
            headers: { Authorization: user2.token },
          }
        );

        assert.fail("Should have thrown an error");
      } catch (err) {
        assert.equal(err.response.status, 400);
        assert.equal(err.response.data.message, "Invite was cancelled");
      }

      const updatedUser = await User.findById(user2._id);

      assert.equal(updatedUser.groups.length, 0);
    });
  });
});
