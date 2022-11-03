const libRewire = require("../../utils/lib-rewire");
const SendGrid = require("../../../lib/sendgrid/sendgrid.js");
const { assert } = require("chai");

const modPath = "lib/sendgrid/index";

describe(modPath, () => {
  let mod;

  beforeEach(() => {
    mod = libRewire(modPath);
  });

  it("should export an instance of SendGrid", () => {
    assert.instanceOf(mod, SendGrid);
  });

  it("should set sendgrid api key", () => {
    assert.equal(mod.sendGrid.client.auth.split(" ")[1], "SG.fakekey");
  });
});
