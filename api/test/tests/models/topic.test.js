const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const fakeTopic = require("../../fakes/topic");
const Topic = require("../../../lib/models/topic");
const dbUtils = require("../../utils/db");
const db = require("../../../lib/db");
const ObjectId = require("mongoose").Types.ObjectId;

chai.use(chaiAsPromised);
const { assert } = chai;

describe("lib/models/topic", () => {
  before(async () => {
    await db.connect();
    await dbUtils.clean();
  });

  beforeEach(async () => {
    await dbUtils.clean();
  });

  after(async () => {
    await db.disconnect();
  });

  describe("schema", () => {
    it("should require a topic name", () => {
      assert.isRejected(Topic.create({ ...fakeTopic(), name: "" }));
    });

    it("should require a topic meeting_id", () => {
      assert.isRejected(
        Topic.create({ ...fakeTopic(), meeting_id: undefined })
      );
    });
  });

  describe("#saveMeetingTopics", () => {
    beforeEach(async () => {
      this.meeting_id = new ObjectId();

      this.fakeTopics = new Array(3).fill(0).map(() => {
        return fakeTopic({ meeting_id: this.meeting_id });
      });

      this.insertedTopics = await Topic.insertMany(this.fakeTopics);
    });

    it("should delete old meeting topics", async () => {
      await Topic.saveMeetingTopics({
        meeting_id: this.meeting_id,
        savedTopics: [this.insertedTopics[0], this.insertedTopics[1]],
      });

      const topics = await Topic.find({ meeting_id: this.meeting_id });

      assert.strictEqual(topics.length, 2);
    });

    it("should update existing meeting topics", async () => {
      const updatedTopicName = "Updated Topic Name";
      const updatedTopicLikes = [new ObjectId()];

      await Topic.saveMeetingTopics({
        meeting_id: this.meeting_id,
        savedTopics: [
          this.insertedTopics[0],
          this.insertedTopics[1],
          {
            _id: this.insertedTopics[2]._id,
            name: updatedTopicName,
            likes: updatedTopicLikes,
          },
        ],
      });

      const [foo, bar, updatedTopic] = await Topic.find({
        meeting_id: this.meeting_id,
      });

      assert.strictEqual(updatedTopic.name, updatedTopicName);
      assert.strictEqual(
        updatedTopic.likes[0].toString(),
        updatedTopicLikes[0].toString()
      );
    });

    it("should add new topics", async () => {
      const newTopic = fakeTopic({ meeting_id: this.meeting_id });

      await Topic.saveMeetingTopics({
        meeting_id: this.meeting_id,
        savedTopics: [...this.insertedTopics, newTopic],
      });

      const [foo, bar, baz, resultingTopic] = await Topic.find({
        meeting_id: this.meeting_id,
      });

      assert.strictEqual(newTopic.name, resultingTopic.name);
      assert.strictEqual(
        newTopic.likes[0].toString(),
        resultingTopic.likes[0].toString()
      );
    });
  });
});
