const { assert } = require("chai");
const dbUtils = require("../../utils/db");
const db = require("../../../lib/db");
const api = require("../../utils/api");
const Topic = require("../../../lib/models/topic");
const Takeaway = require("../../../lib/models/takeaway");
const Meeting = require("../../../lib/models/meeting");
const ActionItem = require("../../../lib/models/action-item");
const fakeTopic = require("../../fakes/topic");
const fakeTakeaway = require("../../fakes/takeaway");
const fakeActionItem = require("../../fakes/action-item");
const fakeMeeting = require("../../fakes/meeting");
const rewire = require("rewire");

const clone = (obj) => JSON.parse(JSON.stringify(obj));

describe("lib/controllers/topic", () => {
  before(async () => {
    this.client = rewire("../../utils/client");

    await api.start();
    await db.connect();
    await dbUtils.clean();

    const res = (
      await this.client.post("/user/register", {
        username: "user3",
        password: "pass",
        email: "email3",
      })
    ).data;

    const res2 = (
      await this.client.post("/user/register", {
        username: "user2",
        password: "pass",
        email: "email2",
      })
    ).data;

    this.user = res.user;
    this.token = res.access_token;

    this.user2 = res2.user;
    this.token2 = res2.access_token;
  });

  beforeEach(async () => {
    this.client.defaults.headers.common["Authorization"] = this.token;
    await dbUtils.clean(["topics", "takeaways", "meetings"]);

    this.meeting = await Meeting.create(
      fakeMeeting({ owner_id: this.user._id })
    );
  });

  after(async () => {
    await api.stop();
    await db.disconnect();
  });

  describe("#create", () => {
    const path = "/topic";

    it("should create topic with valid inputs", async () => {
      const topic = fakeTopic({ meeting_id: this.meeting._id });

      const res = await this.client.post(path, topic);

      assert.equal(res.status, 201, "failed to create topic with valid inputs");

      assert.equal(
        res.data.name,
        topic.name,
        "created topic with incorrect name: " + res.data.name
      );

      const created = await Topic.find({});

      assert.equal(created.length, 1);
      assert.equal(created[0].name, topic.name);
      assert.equal(created[0].likes[0], topic.likes[0]);
      assert.deepEqual(created[0].meeting_id, topic.meeting_id);
    });

    it("should 403 if not owner or participant", async () => {
      this.client.defaults.headers.common["Authorization"] = this.token2;

      const topic = fakeTopic({ meeting_id: this.meeting._id });

      await assert.isRejected(
        this.client.post(path, topic),
        "Request failed with status code 403"
      );
    });
  });

  describe("#update", () => {
    beforeEach(async () => {
      this.topic = await Topic.create(fakeTopic({ owner_id: this.user._id }));
    });

    it("should update topic name", async () => {
      const res = await this.client.patch("/topic/" + this.topic._id, {
        ...this.topic._doc,
        name: "new name",
        description: "new description",
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.name, "new name");

      const [topic] = await Topic.find({ _id: this.topic._id });

      assert.strictEqual(topic.name, "new name");
      assert.strictEqual(topic.description, "new description");
      assert.strictEqual(topic.status, this.topic.status);
      assert.deepEqual(topic.likes, this.topic.likes);
    });

    it("should 403 if not topic owner", async () => {
      this.client.defaults.headers.common["Authorization"] = this.token2;

      await assert.isRejected(
        this.client.patch("/topic/" + this.topic._id, {}),
        "Request failed with status code 403"
      );
    });
  });

  describe("#delete", () => {
    it("should delete a topic", async () => {
      const { _id } = await Topic.create(
        fakeTopic({ owner_id: this.user._id })
      );

      const res = await this.client.delete(`topic/${_id}`);

      assert.equal(res.status, 204, "bad status code");

      const found = await Topic.find({ _id });

      assert.equal(found.length, 0, "did not delete topic");
    });

    it("should 403 if not topic owner", async () => {
      const { _id } = await Topic.create(fakeTopic());

      await assert.isRejected(
        this.client.delete(`topic/${_id}`),
        "Request failed with status code 403"
      );
    });
  });

  describe("#like", () => {
    beforeEach(async () => {
      this.topic = await Topic.create(
        fakeTopic({ meeting_id: this.meeting._id })
      );
    });

    it("should add a topic like", async () => {
      const res = await this.client.patch("/topic/" + this.topic._id + "/like");

      assert.strictEqual(res.status, 200);
      assert.isTrue(res.data.likes.includes(this.user.email));

      const [topic] = await Topic.find({});

      assert.isTrue(topic.likes.includes(this.user.email));
    });

    it("should remove a topic like", async () => {
      this.topic = await Topic.create(
        fakeTopic({ meeting_id: this.meeting._id, likes: [this.user.email] })
      );

      const res = await this.client.patch("/topic/" + this.topic._id + "/like");

      assert.strictEqual(res.status, 200);
      assert.isFalse(res.data.likes.includes(this.user.email));

      const [topic] = await Topic.find({});

      assert.isFalse(topic.likes.includes(this.user.email));
    });

    it("should 403 if not owner or participant", async () => {
      this.client.defaults.headers.common["Authorization"] = this.token2;

      await assert.isRejected(
        this.client.patch("/topic/" + this.topic._id + "/like"),
        "Request failed with status code 403"
      );
    });
  });

  describe("#switch", () => {
    beforeEach(async () => {
      this.topic = await Topic.create(
        fakeTopic({ meeting_id: this.meeting._id, status: "open" })
      );

      this.topic2 = await Topic.create(
        fakeTopic({ meeting_id: this.meeting._id, status: "live" })
      );
    });

    it("should set the selected topic to live", async () => {
      const res = await this.client.patch(
        "/topic/" + this.topic._id + "/switch"
      );

      assert.strictEqual(res.status, 200);

      const [topic] = await Topic.find({ _id: this.topic._id });

      assert.strictEqual(topic.status, "live");
      assert.strictEqual(topic.name, this.topic.name);
    });

    it("should update any live topics to open", async () => {
      await this.client.patch("/topic/" + this.topic._id + "/switch");

      const [topic2] = await Topic.find({ _id: this.topic2._id });

      assert.strictEqual(topic2.status, "open");
    });

    it("should return topic switchedTo and switchedFrom", async () => {
      const res = await this.client.patch(
        "/topic/" + this.topic._id + "/switch"
      );

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.switchedTo._id, clone(this.topic._id));
      assert.strictEqual(res.data.switchedFrom._id, clone(this.topic2._id));
    });

    it("should 403 if not owner or participant", async () => {
      this.client.defaults.headers.common["Authorization"] = this.token2;

      await assert.isRejected(
        this.client.patch("/topic/" + this.topic._id + "/switch"),
        "Request failed with status code 403"
      );
    });
  });

  describe("#close", () => {
    beforeEach(async () => {
      this.topic = await Topic.create(
        fakeTopic({ meeting_id: this.meeting._id, status: "live" })
      );
    });

    it("should set the selected topic to closed", async () => {
      const res = await this.client.patch(
        "/topic/" + this.topic._id + "/close"
      );

      assert.strictEqual(res.status, 200);

      const [topic] = await Topic.find({ _id: this.topic._id });

      assert.strictEqual(topic.status, "closed");
    });

    it("should 403 if not owner or participant", async () => {
      this.client.defaults.headers.common["Authorization"] = this.token2;

      await assert.isRejected(
        this.client.patch("/topic/" + this.topic._id + "/close"),
        "Request failed with status code 403"
      );
    });
  });

  describe("#getTakeaways", () => {
    beforeEach(async () => {
      this.inserted_topic = await Topic.create(
        fakeTopic({ meeting_id: this.meeting._id })
      );
    });

    it("should get topic's takeaways", async () => {
      const takeaway = fakeTakeaway({
        topic_id: this.inserted_topic._id.toString(),
        owner_id: this.user._id,
      });

      await Takeaway.create(takeaway);

      const {
        data: [foundTakeaway],
      } = await this.client.get(
        "/topic/" + this.inserted_topic._id + "/takeaways"
      );

      assert.strictEqual(takeaway.name, foundTakeaway.name);
      assert.strictEqual(takeaway.description, foundTakeaway.description);
      assert.strictEqual(takeaway.topic_id, foundTakeaway.topic_id);
      assert.strictEqual(takeaway.owner_id, foundTakeaway.owner_id);
    });

    it("should 403 if not owner or participant", async () => {
      this.client.defaults.headers.common["Authorization"] = this.token2;

      await assert.isRejected(
        this.client.get("/topic/" + this.inserted_topic._id + "/takeaways"),
        "Request failed with status code 403"
      );
    });
  });

  describe("#getActionItems", () => {
    beforeEach(async () => {
      this.topic = await Topic.create(
        fakeTopic({ meeting_id: this.meeting._id })
      );
    });

    it("should get topic's action items", async () => {
      const actionItem = fakeActionItem({
        topic_id: this.topic._id.toString(),
        owner_id: this.user._id,
      });

      await ActionItem.create(actionItem);

      const {
        data: [foundActionItem],
      } = await this.client.get("/topic/" + this.topic._id + "/action-items");

      assert.strictEqual(actionItem.name, foundActionItem.name);
      assert.strictEqual(actionItem.description, foundActionItem.description);
      assert.strictEqual(actionItem.topic_id, foundActionItem.topic_id);
      assert.strictEqual(actionItem.owner_id, foundActionItem.owner_id);
    });

    it("should 403 if not owner or participant", async () => {
      this.client.defaults.headers.common["Authorization"] = this.token2;

      await assert.isRejected(
        this.client.get("/topic/" + this.topic._id + "/action-items"),
        "Request failed with status code 403"
      );
    });
  });
});
