const libRewire = require("../../utils/lib-rewire");
const templates = require("../../../lib/sendgrid/templates");
const sinon = require("sinon");
const { assert } = require("chai");

const modPath = "lib/sendgrid/sendgrid";

const authorizedEmail = "meetingminderbot@meetingminder.dev";

describe(modPath, () => {
  let mod;

  beforeEach(() => {
    mod = libRewire(modPath);
  });

  describe("constructor", () => {
    it("should set sendgrids api key", () => {
      const setApiKeyStub = sinon.stub().returns();
      mod.__set__("sgMail.setApiKey", setApiKeyStub);

      new mod({ apiKey: "key" });

      sinon.assert.calledOnceWithExactly(setApiKeyStub, "key");
    });

    it("should set a defaultEmail to sendgrid authorized email", () => {
      const inst = new mod({ apiKey: "key" });

      assert.equal(inst.defaultEmail, authorizedEmail);
    });
  });

  describe("sendVoteEmail", () => {
    it("should call sendgrid.send with correct args", async () => {
      const sendStub = sinon.stub().resolves();
      mod.__set__("sgMail.send", sendStub);

      const inst = new mod({ apiKey: "key" });

      await inst.sendVoteEmail("email", "username", {
        name: "First Meet",
        _id: "123",
      });

      sinon.assert.calledOnceWithExactly(sendStub, {
        to: "email",
        from: authorizedEmail,
        ...templates.buildVoteEmail("username", {
          name: "First Meet",
          _id: "123",
        }),
      });
    });

    it("should handle sendgrid errors", async () => {
      const sendStub = sinon.stub().rejects();
      mod.__set__("sgMail.send", sendStub);

      const inst = new mod({ apiKey: "key" });

      await inst.sendVoteEmail("email", "username", {
        name: "First Meet",
        _id: "123",
      });
    });
  });

  describe("sendReminderEmail", () => {
    it("should call sendgrid.send with correct args", async () => {
      const sendStub = sinon.stub().resolves();
      mod.__set__("sgMail.send", sendStub);

      const inst = new mod({ apiKey: "key" });

      await inst.sendReminderEmail("email", "username", {
        name: "First Meet",
        _id: "123",
      });

      sinon.assert.calledOnceWithExactly(sendStub, {
        to: "email",
        from: authorizedEmail,
        ...templates.buildReminderEmail("username", {
          name: "First Meet",
          _id: "123",
        }),
      });
    });

    it("should handle sendgrid errors", async () => {
      const sendStub = sinon.stub().rejects();
      mod.__set__("sgMail.send", sendStub);

      const inst = new mod({ apiKey: "key" });

      await inst.sendReminderEmail("email", "username", {
        name: "First Meet",
        _id: "123",
      });
    });
  });

  describe("sendWelcomeEmail", () => {
    it("should call sendgrid.send with correct args", async () => {
      const sendStub = sinon.stub().resolves();
      mod.__set__("sgMail.send", sendStub);

      const inst = new mod({ apiKey: "key" });

      await inst.sendWelcomeEmail("email", "username");

      sinon.assert.calledOnceWithExactly(sendStub, {
        to: "email",
        from: authorizedEmail,
        ...templates.buildWelcomeEmail("username"),
      });
    });

    it("should handle sendgrid errors", async () => {
      const sendStub = sinon.stub().rejects();
      mod.__set__("sgMail.send", sendStub);

      const inst = new mod({ apiKey: "key" });

      await inst.sendWelcomeEmail("email", "username");
    });
  });

  describe("sendResetPasswordEmail", () => {
    it("should call sendgrid.send with correct args", async () => {
      const sendStub = sinon.stub().resolves();
      mod.__set__("sgMail.send", sendStub);

      const inst = new mod({ apiKey: "key" });

      await inst.sendPasswordResetEmail({
        email: "email",
        resetCode: "code",
        username: "username",
        userId: "123",
      });

      sinon.assert.calledOnceWithExactly(sendStub, {
        to: "email",
        from: authorizedEmail,
        ...templates.buildPasswordResetEmail({
          userId: "123",
          resetCode: "code",
          username: "username",
        }),
      });
    });

    it("should handle sendgrid errors", async () => {
      const sendStub = sinon.stub().rejects();
      mod.__set__("sgMail.send", sendStub);

      const inst = new mod({ apiKey: "key" });

      await inst.sendWelcomeEmail("email", "username");
    });
  });
});
