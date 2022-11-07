const Meeting = require("../../../lib/models/meeting");
const Participant = require("../../../lib/models/participant");
const fakeMeeting = require("../../fakes/meeting");
const fakeParticipant = require("../../fakes/participant");
const fakeUser = require("../../fakes/user");
const { clean } = require("../../utils/db");
const db = require("../../../lib/db");
const { assert } = require("chai");
const libRewire = require("../../utils/lib-rewire");

const modulePath = "lib/util/authorization";

describe(modulePath, () => {
  beforeEach(async () => {
    await db.connect();
    await clean();

    this.meeting = fakeMeeting();
    this.inserted_meeting = await Meeting.create(this.meeting);

    this.participants = Array.from({ length: 3 }).map(() => {
      return fakeParticipant({ meeting_id: this.inserted_meeting._id });
    });

    this.inserted_participants = await Participant.insertMany(
      this.participants
    );

    this.module = libRewire(modulePath);
  });

  after(async () => {
    await db.disconnect();
  });

  describe("#checkParticipant", () => {
    it("should return meeting if user is participant", async () => {
      const meeting = await this.module.checkParticipant(
        this.inserted_meeting._id,
        {
          user: fakeUser({ _id: "someid", email: this.participants[0].email }),
        }
      );

      assert.equal(meeting.name, this.inserted_meeting.name);
    });

    it("should return meeting if user is meeting owner", async () => {
      const meeting = await this.module.checkParticipant(
        this.inserted_meeting._id,
        { user: fakeUser({ _id: this.meeting.owner_id }) }
      );

      assert.equal(meeting.name, this.inserted_meeting.name);
    });

    it("should return meeting if participant is participant", async () => {
      const meeting = await this.module.checkParticipant(
        this.inserted_meeting._id,
        {
          participant: fakeParticipant({
            _id: this.participants[0]._id,
            meeting_id: this.inserted_meeting._id,
          }),
        }
      );

      assert.equal(meeting.name, this.inserted_meeting.name);
    });

    it("should reject if user is not participant", async () => {
      return assert.isRejected(
        this.module.checkParticipant(this.inserted_meeting._id, {
          user: fakeUser({ _id: "some_id", email: "some_email" }),
        })
      );
    });

    it("should reject if participant is not participant", async () => {
      return assert.isRejected(
        this.module.checkParticipant(this.inserted_meeting._id, {
          participant: fakeParticipant({
            _id: this.participants[0]._id,
          }),
        })
      );
    });
  });

  describe("#checkOwner", () => {
    it("should return document and doc if doc user is owner", async () => {
      const document = await this.module.checkOwner(
        this.inserted_meeting._id,
        "meetings",
        { user: { _id: this.meeting.owner_id } }
      );

      assert.equal(this.inserted_meeting.name, document.name);
    });

    it("should return authorized and doc if doc participant is owner", async () => {
      const document = await this.module.checkOwner(
        this.inserted_meeting._id,
        "meetings",
        { participant: { _id: this.meeting.owner_id } }
      );

      assert.equal(this.inserted_meeting.name, document.name);
    });

    it("should reject if not owner", async () => {
      return assert.isRejected(
        this.module.checkOwner(this.inserted_meeting._id, "meetings", {
          user: { _id: "some_id" },
        })
      );
    });
  });

  describe("#checkUser", () => {
    it("should not throw if user", async () => {
      await this.module.checkUser({ usr: true });
    });

    it("should return unauthorized if not user", async () => {
      await assert.isRejected(this.module.checkUser());
    });
  });
});
