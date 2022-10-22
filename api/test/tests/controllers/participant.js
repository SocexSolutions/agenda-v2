const { assert } = require("chai");
const dbUtils = require("../../utils/db");
const db = require("../../../lib/db");
const api = require("../../utils/api");
const client = require("../../utils/client");
const Meeting = require("../../../lib/models/meeting");
const Participant = require("../../../lib/models/participant");
const fakeParticipant = require("../../fakes/participant");
const fakeMeeting = require("../../fakes/meeting");

describe("lib/controllers/participant", () => {
  before(async () => {
    await api.start();
    await db.connect();
    await dbUtils.clean();

    const res = await client.post("/user/register", {
      email: "email",
      password: "pass",
      username: "username",
    });

    this.user = res.data.user;
    this.token = res.data.token;
  });

  beforeEach(async () => {
    await dbUtils.clean(["participants", "meetings"]);

    client.defaults.headers.common["Authorization"] = this.token;

    this.meeting = await Meeting.create(
      fakeMeeting({ owner_id: this.user._id })
    );
  });

  after(async () => {
    await api.stop();
    await db.disconnect();
  });

  describe("#create", () => {
    const path = "/participant";

    it("should create a participant with valid inputs", async () => {
      const participant = fakeParticipant({
        meeting_id: this.meeting._id,
      });

      const res = await client.post(path, participant);

      assert.equal(res.status, 201);
      assert.equal(res.data.email, participant.email);
      assert.equal(res.data.meeting_id, participant.meeting_id);

      const found = await Participant.findOne({ _id: res.data._id });

      assert.equal(found.email, participant.email);
      assert.equal(
        found.meeting_id.toString(),
        participant.meeting_id.toString()
      );
    });

    it("should 403 if not meeting owner", async () => {
      const created = await Meeting.create(fakeMeeting());

      const participant = fakeParticipant({
        meeting_id: created._id,
      });

      try {
        await client.post(path, participant);
        assert.fail();
      } catch (err) {
        assert.equal(err.response.status, 403);
      }
    });
  });

  describe("#delete", () => {
    it("should delete a participant", async () => {
      const { _id } = await Participant.create(
        fakeParticipant({ meeting_id: this.meeting._id })
      );

      const res = await client.delete(`participant/${_id}`);

      assert.equal(res.status, 204, "bad status code");

      const found = await Participant.find({ _id });

      assert.equal(found.length, 0, "did not delete participant");
    });

    it("should 403 if not meeting owner", async () => {
      const { _id } = await Participant.create(fakeParticipant());

      await assert.isRejected(
        client.delete(`participant/${_id}`),
        "Request failed with status code 403"
      );
    });
  });

  describe("#getMeetings", () => {
    it("should return meetings", async () => {
      const res = await Meeting.insertMany([fakeMeeting(), fakeMeeting()]);

      const participants = [];

      res.forEach((meeting) => {
        participants.push({ email: "jack@aol.com", meeting_id: meeting._id });
      });

      await Participant.insertMany(participants);

      const { data } = await client.get("participant/meetings/jack@aol.com ");

      assert.strictEqual(data.length, 2);
      assert.deepEqual(data[1].name, res[1].name);
    });
  });
});
