const dbUtils = require("../../utils/db");
const libRewire = require("../../utils/lib-rewire");
const db = require("../../../lib/db");
const { assert } = require("chai");
const sinon = require("sinon");

const modPath = "lib/util/mutex-lock";

describe(modPath, () => {
  let mod;

  before(async () => {
    await db.connect();
  });

  beforeEach(async () => {
    await dbUtils.clean();

    mod = libRewire(modPath);
  });

  after(async () => {
    await dbUtils.clean();
    await db.disconnect();
  });

  it("should acquire a lock", async () => {
    const release = await mod.acquire("test");
    await release();
  });

  it("should not allow multiple locks with the same key", async () => {
    mod.__set__("wait", sinon.stub().resolves({ key: "lock" }));

    await mod.acquire("test");
    return assert.isRejected(mod.acquire("test"));
  });

  it("should retry locks 5 times", async () => {
    const waitStub = sinon.stub().resolves({ key: "lock" });
    mod.__set__("wait", waitStub);

    await mod.acquire("test");
    await assert.isRejected(mod.acquire("test"));

    sinon.assert.callCount(waitStub, 5);
  });

  it("should release lock when release is called", async () => {
    const release = await mod.acquire("test");
    await release();
    await mod.acquire("test");
  });

  it("should create locks that expire", async () => {
    await mod.acquire("test", 50);

    await new Promise((r) => setTimeout(() => r(), 55));

    await mod.acquire("test");
  });
});
