const SendGrid = require("./sendgrid");

module.exports = new SendGrid({
  apiKey: process.env.SENDGRID_API_KEY || "SG.fakekey",
});
