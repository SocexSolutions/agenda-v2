const dbUtils = require("../../utils/db");
const db = require("../../../lib/db");
const api = require("../../utils/api");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const client = require("../../utils/client");
const libRewire = require("../../utils/lib-rewire");
const sinon = require("sinon");

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
});
