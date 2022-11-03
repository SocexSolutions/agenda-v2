const sinon = require("sinon");
const { assert } = require("chai");
const router = require("express").Router();
const api = require("../../utils/api");
const libRewire = require("../../utils/lib-rewire");
const client = require("../../utils/client");

const modulePath = "lib/middleware/req-logger";

describe(modulePath, () => {
  beforeEach(() => {
    this.module = libRewire(modulePath);
  });

  afterEach(() => {
    api.stop();
  });

  this.controller = (req, res) => {
    return res.status(200).send("hello");
  };

  this.bindRoutesStartServer = (urlPath, middleware, controller) => {
    router.use(urlPath, middleware, controller);

    api.start("/api", router);
  };

  it("should call controller regardless of failure", async () => {
    const jobi = {
      info: sinon.stub(),
    };

    const urlPath = "/test1";

    this.module.__set__({ jobi });

    this.bindRoutesStartServer(urlPath, this.module, this.controller);

    const res = await client.post(urlPath, { msg: "hi" });

    sinon.assert.calledOnce(jobi.info);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data, "hello");
  });

  it("should log request and response", async () => {
    const jobi = {
      info: sinon.stub().returns(),
      debug: sinon.stub().returns(),
      trace: sinon.stub().returns(),
    };

    const urlPath = "/test2";

    this.module.__set__({ jobi });

    this.bindRoutesStartServer(urlPath, this.module, this.controller);

    await client.post(urlPath, { msg: "hi" });

    sinon.assert.calledOnceWithExactly(jobi.info, "POST", "/api" + urlPath);

    assert.deepEqual(
      jobi.debug.getCall(0).args,
      ["body:", { msg: "hi" }],
      "bad method body log"
    );

    sinon.assert.calledOnce(jobi.trace);

    assert.deepEqual(
      jobi.debug.getCall(1).args,
      ["response payload:", "hello"],
      "bad response payload log"
    );
  });
});
