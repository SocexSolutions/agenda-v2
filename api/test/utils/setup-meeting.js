const client = require("./client");
const fakeMeeting = require("../fakes/meeting");
const Meeting = require("../../lib/models/meeting");

async function setupMeeting() {
  const res = await client.post("/user/register", {
    username: "user",
    password: "pass",
    email: "email@email.com",
  });

  const user = res.data.user;
  user.access_token = res.data.access_token;

  const res2 = await client.post("/user/register", {
    username: "user2",
    password: "pass2",
    email: "email2@email.com",
  });

  const participant = res2.data.user;
  participant.token = res2.data.access_token;

  const res3 = await client.post("/user/register", {
    username: "user3",
    password: "pass3",
    email: "email3@email.com",
  });

  const unrelated = res3.data.user;
  unrelated.token = res3.data.access_token;

  const meeting = await Meeting.create({
    ...fakeMeeting(),
    owner: user._id,
    participants: ["email2@email.com"],
  });

  return {
    user,
    participant,
    unrelated,
    meeting,
  };
}

module.exports = setupMeeting;
