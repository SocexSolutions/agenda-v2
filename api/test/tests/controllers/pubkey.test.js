const { assert } = require("chai");
const api = require("../../utils/api");
const client = require("../../utils/client");
const fs = require("fs");
const path = require("path");

describe("lib/controllers/pubkey.js", () => {
  const urlPath = "/pubkey";

  before(async () => {
    await api.start();
  });

  after(async () => {
    await api.stop();
  });

  it("should respond with a public key", async () => {
    const res = await client.get(urlPath);

    const key = fs.readFileSync(
      path.join(__dirname, "../../../keys/id_rsa_pub.pem"),
      "utf8"
    );

    assert.equal(res.status, 200);
    assert.equal(res.data, key);
  });
});
