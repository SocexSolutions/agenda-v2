const sinon = require("sinon");
const path = require("path");
const fs = require("fs");
const JsonWebToken = require("jsonwebtoken");
const client = require("../../utils/client");
const dbUtils = require("../../utils/db");
const db = require("../../../lib/db");
const api = require("../../utils/api");
const libRewire = require("../../utils/lib-rewire");
const { assert } = require("chai");

const modulePath = "lib/middleware/authenticate";

const pathToKey = path.join(__dirname, "../../../keys/id_rsa_priv.pem");
const PRIV_KEY = fs.readFileSync(pathToKey, "utf8");

describe(modulePath, () => {
  before(async () => {
    await api.start();
    await db.connect();
    await dbUtils.clean();

    const res = await client.post("/user/register", {
      username: "user",
      password: "pass",
      email: "email",
    });

    this.token = res.data.token;
    this.user = res.data.user;
  });

  after(async () => {
    await api.stop();
    await db.disconnect();
  });

  beforeEach(() => {
    this.module = libRewire(modulePath);
  });

  it("should accept valid user token", async () => {
    const payload = {
      sub: this.user._id,
      iat: Date.now(),
      usr: true,
    };

    const signedToken = JsonWebToken.sign(payload, PRIV_KEY, {
      expiresIn: "1d",
      algorithm: "RS256",
    });

    const request = { headers: { authorization: "Bearer " + signedToken } };
    const next = sinon.stub().resolves();

    await this.module(request, {}, next);

    sinon.assert.calledOnce(next);
  });

  it("should accept a valid participant token", async () => {
    const payload = {
      sub: this.user._id,
      iat: Date.now(),
    };

    const signedToken = JsonWebToken.sign(payload, PRIV_KEY, {
      expiresIn: "1d",
      algorithm: "RS256",
    });

    const request = { headers: { authorization: "Bearer " + signedToken } };
    const next = sinon.stub().resolves();

    await this.module(request, {}, next);

    sinon.assert.calledOnce(next);
  });

  it("should add email, username, _id, and groups to request credentials for users", async () => {
    const payload = {
      sub: this.user._id,
      iat: Date.now(),
      usr: true,
    };

    const signedToken = JsonWebToken.sign(payload, PRIV_KEY, {
      expiresIn: "1d",
      algorithm: "RS256",
    });

    const request = { headers: { authorization: "Bearer " + signedToken } };
    const next = sinon.stub().resolves();

    await this.module(request, {}, next);

    assert.deepInclude(
      {
        ...request.credentials.user,
        _id: request.credentials.user._id.toString(),
      },
      {
        email: this.user.email,
        username: this.user.username,
        _id: this.user._id,
        groups: this.user.groups,
      }
    );
  });

  it("should add email and _id to request credentials for participants", async () => {
    const payload = {
      sub: this.user._id,
      iat: Date.now(),
    };

    const signedToken = JsonWebToken.sign(payload, PRIV_KEY, {
      expiresIn: "1d",
      algorithm: "RS256",
    });

    const request = { headers: { authorization: "Bearer " + signedToken } };
    const next = sinon.stub().resolves();

    await this.module(request, {}, next);

    assert.deepInclude(
      {
        ...request.credentials.participant,
        _id: request.credentials.participant._id.toString(),
      },
      {
        email: this.user.email,
        _id: this.user._id,
      }
    );
  });

  it("should not accept an invalid auth token", async () => {
    const request = { headers: { authorization: "Bearer token" } };
    const response = {
      status: sinon.stub().returns({
        json: sinon.stub().returns(),
      }),
    };
    const next = sinon.stub().resolves();

    await this.module(request, response, next);

    sinon.assert.calledOnceWithExactly(response.status, 401);
    sinon.assert.notCalled(next);
  });

  it("should catch failures", async () => {
    const request = { headers: { authorization: "bearer" } };
    const response = {
      status: sinon.stub().returns({
        json: sinon.stub().returns(),
      }),
    };
    const next = sinon.stub().resolves();

    await this.module(request, response, next);

    sinon.assert.notCalled(next);
    sinon.assert.calledOnceWithExactly(response.status, 401);
  });
});
