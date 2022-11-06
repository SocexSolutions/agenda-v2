const fs = require("fs");
const path = require("path");

module.exports = {
  pubkey(req, res) {
    const key = fs.readFileSync(
      path.join(__dirname, "../../keys/id_rsa_pub.pem"),
      "utf8"
    );

    return res.status(200).send(key);
  },
};
