const { assert } = require("chai");
const dbUtils = require("../../utils/db");
const db = require("../../../lib/db");
const api = require("../../utils/api");
const Topic = require("../../../lib/models/topic");
const Meeting = require("../../../lib/models/meeting");
const ActionItem = require("../../../lib/models/action-item");
const fakeTopic = require("../../fakes/topic");
const fakeActionItem = require("../../fakes/action-item");
const fakeMeeting = require("../../fakes/meeting");
const rewire = require("rewire");

describe("lib/controllers/action-item", () => {
  before(async () => {
    this.client = rewire("../../utils/client");

    await api.start();
    await db.connect();
    await dbUtils.clean();

    const [user1, user2, participant] = await Promise.all([
      this.client.post("/user/register", {
        username: "user",
        password: "pass",
        email: "email",
      }),
      this.client.post("/user/register", {
        username: "user2",
        password: "pass",
        email: "email2",
      }),
      this.client.post("/user/register", {
        username: "user3",
        password: "pass",
        email: "email3",
      }),
    ]);

    this.user = user1.data.user;
    this.token = user1.data.token;

    this.user2 = user2.data.user;
    this.token2 = user2.data.token;

    this.participant = participant.data.user;
    this.participantToken = participant.data.token;
  });

  beforeEach(async () => {
    this.client.defaults.headers.common["Authorization"] = this.token;
    await dbUtils.clean(["topics", "meetings", "actionitems"]);

    this.meeting = await Meeting.create(
      fakeMeeting({ owner_id: this.user._id })
    );

    this.topic = await Topic.create(
      fakeTopic({ meeting_id: this.meeting._id })
    );

    await this.client.post("/participant", {
      meeting_id: this.meeting._id,
      email: this.participant.email,
    });
  });

  after(async () => {
    await api.stop();
    await db.disconnect();
  });

  describe("#create", () => {
    const path = "/action-item";

    it("should create an action item", async () => {
      const actionItem = fakeActionItem({
        meeting_id: this.meeting._id,
        topic_id: this.topic._id,
      });

      const res = await this.client.post(path, actionItem);

      assert.equal(res.status, 201);
      assert.equal(res.data.name, actionItem.name);

      const created = await ActionItem.findById(res.data._id);

      assert.equal(created.name, actionItem.name);
      assert.equal(created.description, actionItem.description);
      assert.equal(created.topic_id, actionItem.topic_id.toString());
      assert.equal(created.meeting_id, actionItem.meeting_id.toString());
      assert.equal(created.owner_id, this.user._id.toString());
      assert.equal(created.completed, false);
    });

    it("should 403 if not participant", async () => {
      const actionItem = fakeActionItem({
        meeting_id: this.meeting._id,
        topic_id: this.topic._id,
      });

      this.client.defaults.headers.common["Authorization"] = this.token2;

      await assert.isRejected(
        this.client.post(path, actionItem),
        "Request failed with status code 403"
      );
    });

    it("should 201 if participant", async () => {
      const actionItem = fakeActionItem({
        meeting_id: this.meeting._id,
        topic_id: this.topic._id,
      });

      this.client.defaults.headers.common["Authorization"] =
        this.participantToken;

      const res = await this.client.post(path, actionItem);

      assert.equal(res.status, 201);
    });
  });

  describe("#update", () => {
    beforeEach(async () => {
      this.actionItem = await ActionItem.create(
        fakeActionItem({
          meeting_id: this.meeting._id,
          topic_id: this.topic._id,
        })
      );
    });

    it("should update an action item", async () => {
      const res = await this.client.patch(
        `/action-item/${this.actionItem._id}`,
        { name: "new name" }
      );

      assert.equal(res.status, 200);
      assert.equal(res.data.name, "new name");

      const updated = await ActionItem.findById(this.actionItem._id);

      assert.equal(updated.name, "new name");
    });

    it("should 403 if not participant", async () => {
      this.client.defaults.headers.common["Authorization"] = this.token2;

      await assert.isRejected(
        this.client.patch(`/action-item/${this.actionItem._id}`, {
          name: "new name",
        }),
        "Request failed with status code 403"
      );
    });

    it("should 201 if participant", async () => {
      this.client.defaults.headers.common["Authorization"] =
        this.participantToken;

      const res = await this.client.patch(
        `/action-item/${this.actionItem._id}`,
        { name: "new name" }
      );

      assert.equal(res.status, 200);
    });
  });

  describe("#delete", () => {
    beforeEach(async () => {
      this.actionItem = await ActionItem.create(
        fakeActionItem({
          meeting_id: this.meeting._id,
          topic_id: this.topic._id,
        })
      );
    });

    it("should delete an action item", async () => {
      const res = await this.client.delete(
        `/action-item/${this.actionItem._id}`
      );

      assert.equal(res.status, 204);

      const found = await ActionItem.findById(this.actionItem._id);

      assert.equal(found, null);
    });

    it("should 403 if not participant", async () => {
      this.client.defaults.headers.common["Authorization"] = this.token2;

      await assert.isRejected(
        this.client.delete(`/action-item/${this.actionItem._id}`),
        "Request failed with status code 403"
      );
    });

    it("should 204 if participant", async () => {
      this.client.defaults.headers.common["Authorization"] =
        this.participantToken;

      const res = await this.client.delete(
        `/action-item/${this.actionItem._id}`
      );

      assert.equal(res.status, 204);
    });
  });
});
