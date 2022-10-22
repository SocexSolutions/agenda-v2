const SendGrid = require("../lib/classes/sendGrid");

const key = "key";

module.exports = new SendGrid({
  key,
  defaultEmail: "zachbarnes@socnet.org",
});
