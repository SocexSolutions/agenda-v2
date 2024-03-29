const dbUtils = require("../../utils/db");
const db = require("../../../lib/db");
const api = require("../../utils/api");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const client = require("../../utils/client");
const libRewire = require("../../utils/lib-rewire");
const sinon = require("sinon");
const User = require("../../../lib/models/user");
const Group = require("../../../lib/models/group");
const ActionItem = require("../../../lib/models/action-item");
const ResetRequest = require("../../../lib/models/reset-request");
const fakeActionItem = require("../../fakes/action-item");

chai.use(chaiAsPromised);

const { assert } = chai;

const user = {
  username: "thudson",
  password: "thudson",
  email: "email",
};

describe("lib/controllers/user.js", () => {
  let mod;

  before(async () => {
    await api.start();
    await db.connect();
  });

  beforeEach(async () => {
    mod = libRewire("lib/controllers/user.js");
    mod.__set__("sendGrid.sendWelcomeEmail", () => {});

    await dbUtils.clean();
  });

  after(async () => {
    await dbUtils.clean();
    await api.stop();
    await db.disconnect();
  });

  describe("#register", () => {
    const path = "/user/register";

    it("should register successfully when given valid creds", async () => {
      const res = await client.post(path, user);
      assert(res.status === 201);
    });

    it("should register return user info", async () => {
      const res = await client.post(path, user);

      assert.strictEqual(res.data.user.email, "email");
      assert.strictEqual(res.data.user.username, "thudson");
      assert.deepEqual(res.data.user.groups, []);
    });

    it("should return an access_token", async () => {
      const res = await client.post(path, user);

      assert.exists(res.data.access_token);
      assert.equal(res.data.access_token.length, 815);
      assert.equal(res.data.access_token.split(".").length, 3);
    });

    it("should not register a user with an existing username", async () => {
      await client.post(path, user);

      return assert.isRejected(client.post(path, user));
    });

    it("should register return an auth token", async () => {
      const res = await client.post(path, user);

      const tokenRegex = new RegExp(/^Bearer\s/);

      assert(tokenRegex.test(res.data.access_token));
    });

    it("should not register user with invalid email", async () => {
      const invalidUser = {
        ...user,
        email: "",
      };

      return assert.isRejected(client.post(path, invalidUser));
    });

    it("should not register user with invalid username", async () => {
      const invalidUser = {
        ...user,
        username: "",
      };

      return assert.isRejected(client.post(path, invalidUser));
    });

    it("should not register user with invalid password", async () => {
      const invalidUser = {
        ...user,
        password: "",
      };

      return assert.isRejected(client.post(path, invalidUser));
    });

    it("should send the user a welcome email", async () => {
      const sendWelcomeStub = sinon.stub().resolves();
      mod.__set__("sendGrid.sendWelcomeEmail", sendWelcomeStub);

      await client.post(path, user);

      sinon.assert.calledOnceWithExactly(
        sendWelcomeStub,
        user.email,
        user.username
      );
    });
  });

  describe("#login", () => {
    const path = "/user/login";

    const loginCreds = {
      username: user.username,
      password: user.password,
    };

    beforeEach(async () => {
      await client.post("/user/register", user);
    });

    it("should login successfully when given valid creds", async () => {
      const res = await client.post(path, loginCreds);

      assert(res.status === 200);

      assert.equal(res.data.user.username, user.username);
      assert.equal(res.data.user.email, user.email);
    });

    it("should return an access_token", async () => {
      const res = await client.post(path, user);

      assert.exists(res.data.access_token);
      assert.equal(res.data.access_token.length, 815);
      assert.equal(res.data.access_token.split(".").length, 3);
    });

    it("should not login user with invalid password", async () => {
      const invalidUser = {
        ...loginCreds,
        password: "bacon",
      };

      return assert.isRejected(client.post(path, invalidUser));
    });

    it("should not login user with invalid username", async () => {
      const invalidUser = {
        ...loginCreds,
        username: "bacon",
      };

      return assert.isRejected(client.post(path, invalidUser));
    });
  });

  describe("#refresh", () => {
    const path = "/user/refresh";

    let token;
    let user_id;

    beforeEach(async () => {
      const { data } = await client.post("/user/register", user);

      token = data.access_token;
      user_id = data.user._id;
    });

    it("should refresh a user info based on token", async () => {
      const options = { headers: { authorization: token } };

      const { data } = await client.get(path, options);

      assert.deepInclude(data, {
        success: true,
        user: {
          _id: user_id,
          email: "email",
          username: "thudson",
          groups: [],
        },
      });
    });

    it("should reject invalid auth token", async () => {
      const options = { headers: { authorization: "token" } };

      return assert.isRejected(client.get(path, options));
    });
  });

  describe("#checkExistingUsername", () => {
    const path = "/user/checkexistingusername";

    it("should 409 if username already exists", async () => {
      const user = await User.create({
        username: "thudson",
        email: "thudson",
        hash: "hash",
        salt: "salt",
      });

      try {
        await client.post(path, { username: user.username });

        assert.fail("should have thrown");
      } catch (err) {
        assert.strictEqual(err.response.status, 409);
      }
    });

    it("should 200 if username does not exist", async () => {
      const res = await client.post(path, { username: "thudson" });

      assert.strictEqual(res.status, 200);
    });
  });

  describe("#checkExistingEmail", () => {
    const path = "/user/checkexistingemail";

    it("should 409 if username already exists", async () => {
      const user = await User.create({
        username: "thudson",
        email: "thudson",
        hash: "hash",
        salt: "salt",
      });

      try {
        await client.post(path, { email: user.email });

        assert.fail("should have thrown");
      } catch (err) {
        assert.strictEqual(err.response.status, 409);
      }
    });

    it("should 200 if username does not exist", async () => {
      const res = await client.post(path, { username: "thudson" });

      assert.strictEqual(res.status, 200);
    });
  });

  describe("resetRequest", () => {
    const path = "/user/reset-request";

    let user;

    beforeEach(async () => {
      const res = await client.post("/user/register", {
        username: "user",
        password: "pass",
        email: "brian@user.com",
        groups: [],
      });
      user = res.data.user;
      user.token = res.data.access_token;
    });

    it("should create a reset request", async () => {
      await client.post(path, { email: user.email });

      const request = await ResetRequest.findOne({ user_id: user._id });

      assert.exists(request);

      assert.equal(request.user_id, user._id);
    });

    it("should send a reset email", async () => {
      const sendResetStub = sinon.stub().resolves();

      mod.__set__("sendGrid.sendPasswordResetEmail", sendResetStub);

      await client.post(path, { email: user.email });

      const request = await ResetRequest.findOne({ user_id: user._id });

      sinon.assert.calledOnceWithExactly(sendResetStub, {
        username: user.username,
        email: user.email,
        resetCode: request.code,
        userId: user._id,
      });
    });

    it("should not create a reset request but 200 if user does not exist", async () => {
      await client.post(path, { email: "brian@brian.com" });

      const all = await ResetRequest.find({});

      assert.equal(all.length, 0);
    });

    it("should reject without an email", async () => {
      return assert.isRejected(client.post(path, {}));
    });
  });

  describe("resetPassword", () => {
    const path = "/user/reset-password";

    let user;

    beforeEach(async () => {
      const res = await client.post("/user/register", {
        username: "user",
        password: "pass",
        email: "user@user.com",
        groups: [],
      });
      user = res.data.user;
      user.token = res.data.access_token;
    });

    it("should reset a password", async () => {
      const request = await ResetRequest.create({
        user_id: user._id,
        code: "code",
        expires: new Date(Date.now() + 1000 *  60 * 10),
      });

      const res = await client.post(path, {
        userId: user._id,
        resetCode: request.code,
        password: "newpass",
      });

      assert.equal(res.status, 200);

      const updatedUser = await User.findById(user._id);

      assert.ok(updatedUser.hash !== user.hash);
      assert.ok(updatedUser.salt !== user.salt);

      const loginRes = await client.post("/user/login", {
        username: user.username,
        password: "newpass",
      });

      assert.equal(loginRes.status, 200);
    });

    it("should not accept expired reset codes", async () => {
      const request = await ResetRequest.create({
        user_id: user._id,
        code: "code",
        expires: new Date(Date.now() - 1000 * 60 * 11),
      });

      return assert.isRejected(
        client.post(path, {
          userId: user._id,
          resetCode: request.code,
          password: "newpass",
        })
      );
    });

    it("should delete the reset request after use", async () => {
      const request = await ResetRequest.create({
        user_id: user._id,
        code: "code",
        expires: new Date(Date.now() + 1000 *  60 * 10),
      });

      await client.post(path, {
        userId: user._id,
        resetCode: request.code,
        password: "newpass",
      });

      const found = await ResetRequest.find({});

      assert.equal(found.length, 0);
    });
  });

  describe("groups", () => {
    let user1;
    let user2;
    let path;

    beforeEach(async () => {
      const res = await client.post("/user/register", {
        username: "user",
        password: "pass",
        email: "brian@user.com",
        groups: [],
      });
      user1 = res.data.user;
      user1.token = res.data.access_token;

      path = `/user/${user1._id}/groups`;

      const res2 = await client.post("/user/register", {
        username: "user2",
        password: "pass2",
        email: "user2@user.com",
      });
      user2 = res2.data.user;
      user2.token = res2.data.access_token;
    });

    it("should return groups that a user owns", async () => {
      await Promise.all([
        Group.create({ name: "1", owner_ids: [user1._id] }),
        Group.create({ name: "2", owner_ids: [user1._id] }),
      ]);

      const { data } = await client.get(path, {
        headers: { Authorization: user1.token },
      });

      assert.equal(data.length, 2);

      const names = data.map((g) => g.name);

      assert.include(names, "1");
      assert.include(names, "2");
    });

    it("should not include groups that a user does not own", async () => {
      await Promise.all([
        Group.create({ name: "1", owner_ids: [user1._id] }),
        Group.create({ name: "2", owner_ids: [user2._id] }),
      ]);

      const { data } = await client.get(path, {
        headers: { Authorization: user1.token },
      });

      assert.equal(data.length, 1);

      const names = data.map((g) => g.name);

      assert.include(names, "1");
    });

    it("should include groups that a user is a member of", async () => {
      const [group1, group2] = await Promise.all([
        Group.create({ name: "1", owner_ids: [user2._id] }),
        Group.create({ name: "2", owner_ids: [user2._id] }),
      ]);

      await User.findOneAndUpdate(
        { _id: user1._id },
        { $addToSet: { groups: [group1._id, group2._id] } }
      );

      const { data } = await client.get(path, {
        headers: { Authorization: user1.token },
      });

      assert.equal(data.length, 2);

      const names = data.map((g) => g.name);

      assert.include(names, "1");
      assert.include(names, "2");
    });

    it("should not include groups that a user is not a member of", async () => {
      const [group1] = await Promise.all([
        Group.create({ name: "1", owner_ids: [user2._id] }),
        Group.create({ name: "2", owner_ids: [user2._id] }),
      ]);

      await User.findOneAndUpdate(
        { _id: user1._id },
        { $addToSet: { groups: [group1._id] } }
      );

      const { data } = await client.get(path, {
        headers: { Authorization: user1.token },
      });

      assert.equal(data.length, 1);

      const names = data.map((g) => g.name);

      assert.include(names, "1");
    });
  });

  describe("actionItems", () => {
    let user1;
    let user2;
    let path;

    beforeEach(async () => {
      const res = await client.post("/user/register", {
        username: "user",
        password: "pass",
        email: "email",
      });

      user1 = res.data.user;
      user1.token = res.data.access_token;

      path = `/user/${user1._id}/actionItems`;

      const res2 = await client.post("/user/register", {
        username: "user2",
        password: "pass2",
        email: "email2",
      });

      user2 = res2.data.user;
      user2.token = res2.data.access_token;
    });

    it("should return action items that a user is assigned to", async () => {
      const [actionItem1, actionItem2] = await Promise.all([
        ActionItem.create(
          fakeActionItem({ assigned_to: [user1.email], name: "a1" })
        ),
        ActionItem.create(
          fakeActionItem({ assigned_to: [user1.email], name: "a2" })
        ),
      ]);

      const { data } = await client.get(path, {
        headers: { Authorization: user1.token },
      });

      assert.equal(data.action_items.length, 2);

      const names = data.action_items.map((a) => a.name);

      assert.include(names, actionItem1.name);
      assert.include(names, actionItem2.name);
    });

    it("should not return action items that a user is not assigned to", async () => {
      const [actionItem1] = await Promise.all([
        ActionItem.create(
          fakeActionItem({ assigned_to: [user1.email], name: "a1" })
        ),
        ActionItem.create(
          fakeActionItem({ assigned_to: [user2.email], name: "a2" })
        ),
      ]);

      const { data } = await client.get(path, {
        headers: { Authorization: user1.token },
      });

      assert.equal(data.action_items.length, 1);

      const names = data.action_items.map((ai) => ai.name);

      assert.include(names, actionItem1.name);
    });

    it("should return completed action items when complete param is true", async () => {
      const [actionItem1] = await Promise.all([
        ActionItem.create(
          fakeActionItem({
            assigned_to: [user1.email],
            name: "a1",
            completed: true,
          })
        ),
        ActionItem.create(
          fakeActionItem({
            assigned_to: [user1.email],
            name: "a2",
            completed: false,
          })
        ),
      ]);

      const { data } = await client.get(`${path}`, {
        params: { completed: true },
        headers: { Authorization: user1.token },
      });

      assert.equal(data.action_items.length, 1);

      const names = data.action_items.map((ai) => ai.name);

      assert.include(names, actionItem1.name);
    });

    it("should return incomplete action items when complete param is false", async () => {
      const [actionItem1] = await Promise.all([
        ActionItem.create(
          fakeActionItem({
            assigned_to: [user1.email],
            name: "a1",
            completed: false,
          })
        ),
        ActionItem.create(
          fakeActionItem({
            assigned_to: [user1.email],
            name: "a2",
            completed: true,
          })
        ),
      ]);

      const { data } = await client.get(`${path}`, {
        params: { completed: false },
        headers: { Authorization: user1.token },
      });

      assert.equal(data.action_items.length, 1);
      assert.equal(data.action_items[0].name, actionItem1.name);
    });

    it("should skip the number of action items specified in the param", async () => {
      const actionItems = Array.from({ length: 20 }).map((_, i) => {
        return fakeActionItem({
          assigned_to: [user1.email],
          name: `${i}`,
        });
      });

      await ActionItem.insertMany(actionItems);

      const { data } = await client.get(`${path}`, {
        params: { skip: 10 },
        headers: { Authorization: user1.token },
      });

      assert.equal(data.action_items.length, 10);

      const names = data.action_items.map((ai) => ai.name);

      for (let i = 10; i < 20; i++) {
        assert.include(names, `${i}`);
      }
    });

    it("should limit the number of action items returned", async () => {
      const actionItems = Array.from({ length: 20 }).map((_, i) => {
        return fakeActionItem({
          assigned_to: [user1.email],
          name: `${i}`,
        });
      });

      await ActionItem.insertMany(actionItems);

      const { data } = await client.get(`${path}`, {
        params: { skip: 10, limit: 5 },
        headers: { Authorization: user1.token },
      });

      assert.equal(data.action_items.length, 5);

      const names = data.action_items.map((ai) => ai.name);

      for (let i = 10; i < 15; i++) {
        assert.include(names, `${i}`);
      }
    });

    it("should return the total count of filtered action items", async () => {
      const actionItems = Array.from({ length: 20 }).map((_, i) => {
        if (i < 10) {
          return fakeActionItem({
            assigned_to: [user1.email],
            name: `${i}`,
          });
        } else {
          return fakeActionItem({
            assigned_to: [user2.email],
            name: `${i}`,
            completed: true,
          });
        }
      });

      await ActionItem.insertMany(actionItems);

      const { data } = await client.get(`${path}`, {
        params: { skip: 10, limit: 5 },
        headers: { Authorization: user1.token },
      });

      assert.equal(data.count, 10);
    });
  });
});
