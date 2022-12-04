const { assert } = require("chai");
const dbUtils = require("../../utils/db");
const db = require("../../../lib/db");
const api = require("../../utils/api");
const client = require("../../utils/client");
const fakeAvatar = require("../../fakes/avatar");
const Avatar = require("../../../lib/models/avatar");

describe("lib/controllers/ui", () => {
  let user_id;
  const path = "/avatar";

  before(async () => {
    await api.start();
    await db.connect();
    await dbUtils.clean();

    const res = await client.post("/user/register", {
      username: "user",
      password: "pass",
      email: "email",
    });

    user_id = res.data.user._id;

    client.defaults.headers.common["Authorization"] = res.data.access_token;
  });

  after(async () => {
    await api.stop();
    await db.disconnect();
  });

  describe("#get", () => {
    it("should get a users avatar", async () => {
      const fake = fakeAvatar()
      await Avatar.create({...fake, user_id: user_id});

      const res = await client.get(path);

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.user_id, user_id);
    });
  });

  describe("#create", () => {
    it("should create a new Avatar", async () => {
      const res = await client.post(path, {});

      assert.strictEqual(res.status, 200);

      const inserted = await Avatar.findOne({ user_id });

      assert.strictEqual(inserted.user_id.toString(), user_id);
    });
  });
});
