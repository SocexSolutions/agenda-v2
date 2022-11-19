const chai = require("chai");
const chaiSubset = require("chai-subset");
const dbUtils = require("../../utils/db");
const db = require("../../../lib/db");
const api = require("../../utils/api");
const client = require("../../utils/client");
const ObjectID = require("mongoose").Types.ObjectId;
const Meeting = require("../../../lib/models/meeting");
const Participant = require("../../../lib/models/participant");
const Topic = require("../../../lib/models/topic");
const User = require("../../../lib/models/user");
const Takeaway = require("../../../lib/models/takeaway");
const ActionItem = require("../../../lib/models/action-item");
const Tag = require("../../../lib/models/tag");
const fakeTopic = require("../../fakes/topic");
const fakeTag = require("../../fakes/tag");
const fakeParticipant = require("../../fakes/participant");
const fakeMeeting = require("../../fakes/meeting");
const fakeTakeaway = require("../../fakes/takeaway");
const fakeActionItem = require("../../fakes/action-item");
const fakeUser = require("../../fakes/user");

chai.use(chaiSubset);

const assert = chai.assert;

describe("lib/controllers/meeting", () => {
  before(async () => {
    await api.start();
    await db.connect();
    await dbUtils.clean();

    const res = await client.post("/user/register", {
      username: "user",
      password: "pass",
      email: "email",
    });

    this.user = res.data.user;
    this.token = res.data.access_token;

    const res2 = await client.post("/user/register", {
      username: "user2",
      password: "pass2",
      email: "email2",
    });

    this.user2 = res2.data.user;
    this.token2 = res2.data.access_token;
  });

  beforeEach(async () => {
    client.defaults.headers.common["Authorization"] = this.token;

    await dbUtils.clean([
      "participants",
      "topics",
      "meetings",
      "takeaways",
      "actionitems",
      "tags",
    ]);
  });

  after(async () => {
    await api.stop();
    await db.disconnect();
  });

  describe("#get", () => {
    it("should fetch a meeting", async () => {
      const meeting = fakeMeeting({
        name: "meeting 1",
        owner_id: this.user._id,
      });

      const created = await Meeting.create(meeting);

      const { data: res } = await client.get(`/meeting/${created._id}`);

      assert.strictEqual(res.name, created.name);
      assert.strictEqual(res._id, created._id.toString());
      assert.strictEqual(res.date, created.date.toISOString());
    });

    it("should 403 if not meeting owner or participant", async () => {
      const meeting = fakeMeeting();

      const created = await Meeting.create(meeting);

      try {
        await client.get(`/meeting/${created._id}`);

        assert.fail("accepted unrelated user");
      } catch (err) {
        assert.strictEqual(err.response.status, 403);
        assert.strictEqual(err.response.data, "unauthorized");
      }
    });
  });

  describe("#create", () => {
    it("should create a meeting", async () => {
      const meeting = fakeMeeting({ owner_id: this.user._id });

      const { data: res } = await client.post(`/meeting`, meeting);

      assert.strictEqual(res.name, meeting.name);
      assert.strictEqual(res.owner_id, this.user._id.toString());
      assert.strictEqual(res.date, meeting.date.toISOString());

      const found = await Meeting.findOne({ _id: res._id });

      assert.strictEqual(found.name, meeting.name);
      assert.strictEqual(res.owner_id, this.user._id.toString());
      assert.strictEqual(found._id.toString(), res._id);
      assert.strictEqual(found.date.toISOString(), meeting.date.toISOString());
    });
  });

  describe("#update", () => {
    it("should update a meeting", async () => {
      const meeting = fakeMeeting({ owner_id: this.user._id });

      const created = await Meeting.create(meeting);

      const newDate = new Date(0).toISOString();

      const { data: res } = await client.patch(`/meeting/${created._id}`, {
        ...meeting,
        name: "new name",
        date: newDate,
      });

      assert.strictEqual(res.name, "new name");
      assert.strictEqual(res.owner_id, this.user._id.toString());
      assert.strictEqual(res.date, newDate);

      const found = await Meeting.findOne({ _id: res._id });

      assert.strictEqual(found.name, "new name");
      assert.strictEqual(res.owner_id, this.user._id.toString());
      assert.strictEqual(found._id.toString(), res._id);
      assert.strictEqual(found.date.toISOString(), newDate);
    });

    it("should 403 if not meeting owner", async () => {
      const meeting = fakeMeeting();

      const created = await Meeting.create(meeting);

      try {
        await client.patch(`/meeting/${created._id}`, {
          ...meeting,
          name: "new name",
        });

        assert.fail("accepted wrong owner");
      } catch (err) {
        assert.strictEqual(err.response.status, 403);
        assert.strictEqual(err.response.data, "unauthorized");
      }
    });
  });

  describe("#aggregate", () => {
    it("should fetch meeting with related data", async () => {
      const meeting = fakeMeeting({ owner_id: this.user._id });

      const { _id } = await Meeting.create(meeting);

      const takeaways = [];
      const actionItems = [];

      const topics = Array.from({ length: 3 }).map(() => {
        const topic = fakeTopic({ meeting_id: _id, _id: new ObjectID() });

        takeaways.push(fakeTakeaway({ meeting_id: _id, topic_id: topic._id }));

        actionItems.push(
          fakeActionItem({ meeting_id: _id, topic_id: topic._id })
        );

        return topic;
      });

      const participants = Array.from({ length: 3 }).map(() => {
        return fakeParticipant({ meeting_id: _id });
      });

      await Promise.all([
        Topic.insertMany(topics),
        Participant.insertMany(participants),
        Takeaway.insertMany(takeaways),
        ActionItem.insertMany(actionItems),
      ]);

      const { data } = await client.get(`/meeting/${_id}/aggregate`);

      assert.containSubset(data.meeting, {
        name: meeting.name,
        date: meeting.date.toISOString(),
        owner_id: this.user._id.toString(),
      });

      assert.strictEqual(data.topics.length, 3);
      assert.strictEqual(data.participants.length, 3);

      data.topics.forEach((t) => {
        assert.lengthOf(t.actionItems, 1);
        assert.lengthOf(t.takeaways, 1);
      });
    });

    it("should 403 if not participant or owner", async () => {
      const meeting = fakeMeeting();

      const { _id } = await Meeting.create(meeting);

      try {
        await client.get(`/meeting/${_id}/aggregate`);
        assert.fail("accepted request from unauthorized user");
      } catch (err) {
        assert.strictEqual(err.response.status, 403);
        assert.strictEqual(err.response.data, "unauthorized");
      }
    });
  });

  describe("#index", () => {
    before(async () => {
      this.ownedMeeting = fakeMeeting({
        owner_id: this.user._id,
        name: "meeting 1",
        date: new Date("05 October 2011 14:48 UTC"),
      });
      this.ownedMeeting2 = fakeMeeting({
        owner_id: this.user._id,
        name: "meeting 2",
        date: new Date("01 January 1990 01:22 UTC"),
      });
      this.ownedMeeting3 = fakeMeeting({
        owner_id: this.user._id,
        name: "meeting 3",
        date: new Date("05 October 2500 14:48 UTC"),
      });
      this.ownedMeeting4 = fakeMeeting({
        owner_id: this.user._id,
        name: "meeting 4",
        date: new Date("25 December 1995 01:22 UTC"),
      });
    });

    it("should get a users owned and participating meetings", async () => {
      const includedMeetingOwner = await User.create(fakeUser());
      const includedMeeting = fakeMeeting({
        owner_id: includedMeetingOwner._id,
        name: "participant meeting",
      });

      await Promise.all([
        Meeting.create(this.ownedMeeting),
        Meeting.create(this.ownedMeeting2), //we will limit before getting to this oldest meeting
        Meeting.create(this.ownedMeeting3), //we will skip this newest meeting for pagenation test
        Meeting.create(this.ownedMeeting4),
      ]);

      const includedRes = await Meeting.create(includedMeeting);

      const participant = fakeParticipant({
        meeting_id: includedRes._id,
        email: this.user.email,
      });

      await Participant.create(participant);

      const { data } = await client.get(`/meeting/?skip=1&limit=3`);

      assert.strictEqual(data.meetings.length, 3); //only send user 3 because of pagination
      assert.strictEqual(data.count, 5); //should still be 5 total (including other pages)
      assert.strictEqual(data.meetings[0].name, "participant meeting"); //Second newest meeting first
      assert.strictEqual(data.meetings[2].name, "meeting 4"); //Second oldest meeting last
      assert.exists(data.owners);
    });

    it("should filter meetings by name", async () => {
      await Promise.all([
        Meeting.create(this.ownedMeeting),
        Meeting.create(this.ownedMeeting2),
        Meeting.create(this.ownedMeeting3),
        Meeting.create(this.ownedMeeting4),
      ]);

      const filters = { name: "meeting 1" };

      const { data } = await client.get(`/meeting/?skip=0&limit=2`, {
        params: filters,
      });

      assert.strictEqual(data.meetings.length, 1);
      assert.strictEqual(data.meetings[0].name, "meeting 1");
    });

    it("should filter meetings by owner", async () => {
      const includedMeetingOwner = await User.create(fakeUser());
      const includedMeeting = fakeMeeting({
        owner_id: includedMeetingOwner._id,
        name: "participant meeting",
      });

      await Promise.all([
        Meeting.create(this.ownedMeeting),
        Meeting.create(this.ownedMeeting2),
      ]);

      const includedRes = await Meeting.create(includedMeeting);

      const participant = fakeParticipant({
        meeting_id: includedRes._id,
        email: this.user.email,
      });

      await Participant.create(participant);

      const filters = {
        owners: [includedMeetingOwner._id.toString()],
      };

      const { data } = await client.get(`/meeting`, {
        params: filters,
      });

      assert.strictEqual(data.meetings.length, 1);
      assert.strictEqual(
        data.meetings[0].owner._id,
        includedMeetingOwner._id.toString()
      );
    });

    it("should return filtered as true", async () => {
      await Meeting.create(this.ownedMeeting);

      const filters = { owners: [], name: "meet" };

      const { data } = await client.get(`/meeting/?skip=0&limit=1`, {
        params: filters,
      });

      assert.strictEqual(data.filtered, true);
    });
  });

  describe("#aggregateSave", () => {
    it("should create meeting", async () => {
      const meeting = fakeMeeting({
        owner_id: this.user._id,
      });

      const {
        data: { meeting: res_meeting },
      } = await client.post("/meeting/aggregate", { meeting });

      assert.equal(res_meeting.name, meeting.name);

      const createdMeeting = JSON.parse(
        JSON.stringify(await Meeting.findById(res_meeting._id))
      );

      assert.containSubset(createdMeeting, {
        name: meeting.name,
        date: meeting.date.toISOString(),
      });
    });

    it("should create meeting with participants", async () => {
      const meeting = fakeMeeting({ owner_id: this.user._id });

      const participants = Array.from({ length: 3 }).map(() => {
        return fakeParticipant({ meeting_id: meeting._id });
      });

      const { data } = await client.post("/meeting/aggregate", {
        meeting,
        participants,
      });

      assert.strictEqual(data.participants.length, 3);

      const createdParticipants = await Participant.find({
        meeting_id: data.meeting._id,
      });

      assert.strictEqual(createdParticipants.length, 3);
    });

    it("should create meeting with topics", async () => {
      const meeting = fakeMeeting({ owner_id: this.user._id });

      const topic = fakeTopic({ meeting_id: meeting._id });

      const { data } = await client.post("/meeting/aggregate", {
        meeting,
        topics: [topic],
      });

      assert.strictEqual(data.topics.length, 1);

      const createdTopics = await Topic.find({
        meeting_id: data.meeting._id,
      });

      assert.strictEqual(createdTopics.length, 1);

      assert.strictEqual(createdTopics[0].name, topic.name);
      assert.strictEqual(createdTopics[0].description, topic.description);
    });

    it("should update a meeting", async () => {
      const meeting = fakeMeeting({ owner_id: this.user._id });

      const { _id } = await Meeting.create(meeting);

      const update = {
        _id: _id.toString(),
        name: "meeting 2",
        date: new Date().toISOString(),
      };

      const { data } = await client.post("/meeting/aggregate", {
        meeting: update,
      });

      assert.strictEqual(data.meeting.name, update.name);
      assert.strictEqual(data.meeting.date, update.date);
      assert.strictEqual(data.meeting._id, update._id, "bad meeting id");

      const [updated] = await Meeting.find({ _id });

      assert.strictEqual(
        this.user._id.toString(),
        updated.owner_id.toString(),
        "bad owner id"
      );

      assert.strictEqual(update.name, updated.name);
      assert.strictEqual(update.date, updated.date.toISOString());
    });

    it("should update a meetings topics", async () => {
      const meeting = fakeMeeting({
        _id: new ObjectID(),
        owner_id: this.user._id,
      });

      const { _id } = await Meeting.create(meeting);

      const new_topic = (
        await Topic.create(
          fakeTopic({ owner_id: this.user._id, meeting_id: _id })
        )
      )._doc;

      const topic = { ...new_topic };

      topic.name = "new topic name";
      topic.likes = [this.user.email.toString()];

      const payload = {
        meeting: { _id: _id.toString() },
        topics: [topic],
      };

      const {
        data: {
          topics: [doc],
        },
      } = await client.post("/meeting/aggregate", payload);

      assert.strictEqual(doc._id, topic._id.toString());
      assert.strictEqual(doc.meeting_id, topic.meeting_id.toString());
      assert.strictEqual(doc.name, topic.name);
      assert.strictEqual(doc.description, topic.description);

      const [updated] = await Topic.find({ meeting_id: _id.toString() });

      assert.strictEqual(updated.name, "new topic name");
    });

    it("should delete old meeting topics", async () => {
      const meeting = fakeMeeting({ owner_id: this.user._id });

      const { _id } = await Meeting.create(meeting);

      const topic = fakeTopic({ meeting_id: _id });

      await Topic.create(topic);

      const payload = {
        meeting: { _id: _id.toString() },
        topics: [],
      };

      const { data } = await client.post("/meeting/aggregate", payload);

      assert.strictEqual(data.topics.length, 0);

      const deleted = await Topic.find({ meeting_id: _id });

      assert.strictEqual(deleted.length, 0);
    });

    it("should delete old meeting participants", async () => {
      const meeting = fakeMeeting({ owner_id: this.user._id });

      const { _id } = await Meeting.create(meeting);

      const participant = fakeParticipant({ meeting_id: _id });

      await Participant.create(participant);

      const payload = {
        meeting: { _id: _id.toString() },
        participants: [],
      };

      const { data } = await client.post("/meeting/aggregate", payload);

      assert.strictEqual(data.participants.length, 0);

      const deleted = await Participant.find({ meeting_id: _id });

      assert.strictEqual(deleted.length, 0);
    });

    it("should 403 if not meeting owner", async () => {
      const meeting = fakeMeeting();

      const created = await Meeting.create(meeting);

      const { _id } = created;

      try {
        await client.post(`/meeting/aggregate`, {
          meeting: { ...created, _id },
        });

        assert.fail("accepted request from unauthorized user");
      } catch (err) {
        assert.strictEqual(err.response.status, 403);
        assert.strictEqual(err.response.data, "unauthorized");
      }
    });
  });

  describe("#getTopics", () => {
    beforeEach(async () => {
      const meeting = fakeMeeting({
        owner_id: this.user._id,
      });

      this.meeting = await Meeting.create(meeting);
    });

    it("should return a meetings topics", async () => {
      const topics = Array.from({ length: 3 }).map(() => {
        return fakeTopic({ meeting_id: this.meeting._id });
      });

      await Topic.insertMany(topics);

      const res = await client.get(`/meeting/${this.meeting._id}/topics`);

      assert.equal(res.status, 200);
      assert.equal(res.data.length, 3, "didnt get topics");
    });

    it("should 403 if not owner or participant", async () => {
      client.defaults.headers.common["Authorization"] = this.token2;

      await assert.isRejected(
        client.get(`/meeting/${this.meeting._id}/topics`),
        "Request failed with status code 403"
      );
    });
  });

  describe("#getParticipants", () => {
    beforeEach(async () => {
      const meeting = fakeMeeting({
        owner_id: this.user._id,
      });

      this.meeting = await Meeting.create(meeting);
    });

    it("should get a meetings participants", async () => {
      const participants = Array.from({ length: 3 }).map(() => {
        return fakeParticipant({ meeting_id: this.meeting._id });
      });

      await Participant.insertMany(participants);

      const res = await client.get(`/meeting/${this.meeting._id}/participants`);

      assert.equal(res.status, 200);
      assert.equal(res.data.length, 3);
    });

    it("should 403 if not meeting owner or participant", async () => {
      client.defaults.headers.common["Authorization"] = this.token2;

      await assert.isRejected(
        client.get(`/meeting/${this.meeting._id}/topics`),
        "Request failed with status code 403"
      );
    });
  });

  describe("#getActionItems", () => {
    beforeEach(async () => {
      const meeting = fakeMeeting({
        owner_id: this.user._id,
      });

      this.meeting = await Meeting.create(meeting);
    });

    it("should return a meetings action items", async () => {
      const actionItems = Array.from({ length: 3 }).map(() => {
        return fakeActionItem({ meeting_id: this.meeting._id });
      });

      await ActionItem.insertMany(actionItems);

      const res = await client.get(`/meeting/${this.meeting._id}/actionitems`);

      assert.equal(res.status, 200);
      assert.equal(res.data.length, 3);
    });

    it("should 403 if not owner or participant", async () => {
      client.defaults.headers.common["Authorization"] = this.token2;

      await assert.isRejected(
        client.get(`/meeting/${this.meeting._id}/actionitems`),
        "Request failed with status code 403"
      );
    });
  });

  describe("#updateStatus", () => {
    beforeEach(async () => {
      const meeting = fakeMeeting({
        owner_id: this.user._id,
        status: "draft",
      });

      this.meeting = await Meeting.create(meeting);
    });

    it("should update a meetings status", async () => {
      const res = await client.patch(`/meeting/${this.meeting._id}/status`, {
        status: "sent",
      });

      assert.equal(res.status, 200);
      assert.equal(res.data.status, "sent");
    });

    it("should 403 if not meeting owner", async () => {
      client.defaults.headers.common["Authorization"] = this.token2;

      await assert.isRejected(
        client.patch(`/meeting/${this.meeting._id}/status`, { status: "sent" }),
        "Request failed with status code 403"
      );
    });
  });

  describe("#delete", () => {
    it("should delete the meeting itself", async () => {
      const meeting = await Meeting.create(
        fakeMeeting({
          owner_id: this.user._id,
        })
      );

      const res = await client.delete(`/meeting/${meeting._id}`);

      assert.equal(res.status, 204);

      const found = await Meeting.findById(meeting._id);

      assert.isNull(found);
    });

    it("should delete related participants", async () => {
      const meeting = await Meeting.create(
        fakeMeeting({
          owner_id: this.user._id,
        })
      );

      await Participant.create(
        fakeParticipant({
          meeting_id: meeting._id,
        })
      );

      await Participant.create(
        fakeParticipant({
          meeting_id: meeting._id,
        })
      );

      await Participant.create(
        fakeParticipant({
          meeting_id: new ObjectID(),
          email: "unrelated@unrelated.com",
        })
      );

      await client.delete(`/meeting/${meeting._id}`);

      const found_participants = await Participant.find();

      assert.equal(found_participants.length, 1);
      assert.equal(found_participants[0].email, "unrelated@unrelated.com");
    });

    it("should delete related topics", async () => {
      const meeting = await Meeting.create(
        fakeMeeting({
          owner_id: this.user._id,
        })
      );

      await Topic.create(
        fakeTopic({
          meeting_id: meeting._id,
        })
      );

      await Topic.create(
        fakeTopic({
          meeting_id: meeting._id,
        })
      );

      await Topic.create(
        fakeTopic({
          meeting_id: new ObjectID(),
          name: "unrelated",
        })
      );

      await client.delete(`/meeting/${meeting._id}`);

      const found_topics = await Topic.find();

      assert.equal(found_topics.length, 1);
      assert.equal(found_topics[0].name, "unrelated");
    });

    it("should delete related takeaways", async () => {
      const meeting = await Meeting.create(
        fakeMeeting({
          owner_id: this.user._id,
        })
      );

      await Takeaway.create(
        fakeTakeaway({
          meeting_id: meeting._id,
        })
      );

      await Takeaway.create(
        fakeTakeaway({
          meeting_id: meeting._id,
        })
      );

      await Takeaway.create(
        fakeTakeaway({
          meeting_id: new ObjectID(),
          name: "unrelated",
        })
      );

      await client.delete(`/meeting/${meeting._id}`);

      const found_takeaways = await Takeaway.find();

      assert.equal(found_takeaways.length, 1);
      assert.equal(found_takeaways[0].name, "unrelated");
    });

    it("should delete related action items", async () => {
      const meeting = await Meeting.create(
        fakeMeeting({
          owner_id: this.user._id,
        })
      );

      await ActionItem.create(
        fakeActionItem({
          meeting_id: meeting._id,
        })
      );

      await ActionItem.create(
        fakeActionItem({
          meeting_id: meeting._id,
        })
      );

      await ActionItem.create(
        fakeActionItem({
          meeting_id: new ObjectID(),
          name: "unrelated",
        })
      );

      await client.delete(`/meeting/${meeting._id}`);

      const found_action_items = await ActionItem.find();

      assert.equal(found_action_items.length, 1);
      assert.equal(found_action_items[0].name, "unrelated");
    });

    it("should 403 if not meeting owner", async () => {
      const meeting = await Meeting.create(fakeMeeting());

      return assert.isRejected(
        client.delete(`/meeting/${meeting._id}`),
        "Request failed with status code 403"
      );
    });
  });

  describe("addTag", () => {
    beforeEach(async () => {
      this.meeting = await Meeting.create(
        fakeMeeting({ owner_id: this.user._id })
      );
      this.tag = await Tag.create(fakeTag());
    });

    it("should add a tag to a meeting if the user is the meeting owner", async () => {
      const res = await client.post(
        `/meeting/${this.meeting._id}/tag/${this.tag._id}`
      );

      assert.equal(res.status, 200);
      assert.equal(res.data.tags.length, 1);
      assert.equal(res.data.tags[0], this.tag._id.toString());

      const found = await Meeting.findById(this.meeting._id);

      assert.equal(found.tags[0]._id.toString(), this.tag._id.toString());
    });

    it("should not add a tag to a meeting if the user is not the meeting owner", async () => {
      client.defaults.headers.common["Authorization"] = this.token2;

      await assert.isRejected(
        client.post(`/meeting/${this.meeting._id}/tag/${this.tag._id}`),
        "Request failed with status code 403"
      );
    });
  });

  describe("removeTag", () => {
    beforeEach(async () => {
      this.tag = await Tag.create(fakeTag());
      this.meeting = await Meeting.create(
        fakeMeeting({ owner_id: this.user._id, tags: [this.tag._id] })
      );
    });

    it("should remove a tag from a meeting if the user is the meeting owner", async () => {
      const res = await client.delete(
        `/meeting/${this.meeting._id}/tag/${this.tag._id}`
      );

      assert.equal(res.status, 200);
      assert.equal(res.data.tags.length, 0);

      const found = await Meeting.findById(this.meeting._id);

      assert.equal(found.tags.length, 0);
    });

    it("should not remove a tag from a meeting if the user is not the meeting owner", async () => {
      client.defaults.headers.common["Authorization"] = this.token2;

      await assert.isRejected(
        client.delete(`/meeting/${this.meeting._id}/tag/${this.tag._id}`),
        "Request failed with status code 403"
      );

      const found = await Meeting.findById(this.meeting._id);

      assert.equal(found.tags.length, 1);
    });
  });
});
