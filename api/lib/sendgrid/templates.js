module.exports = {
  buildWelcomeEmail(username) {
    return {
      subject: "Welcome to MeetingMinder!",
      text: `Welcome to MeetingMinder, ${username}!`,
      html: `<p>Welcome to MeetingMinder, ${username}!</p>`,
    };
  },
  buildVoteEmail(username, meeting) {
    return {
      subject: "MeetingMinder Voting Invite",
      text: `Hey ${username}, have been invited to vote on a meeting: ${meeting.name}`,
      html: `<p>You have been invited to vote on a meeting: ${meeting.name}</p>
      <p>Click <a href="https://meetingminder.dev/meeting/${meeting._id}/vote">here</a> to go to the voting page.</p>`,
    };
  },
  buildReminderEmail(username, meeting) {
    return {
      subject: "MeetingMinder Meeting Started",
      text: `Hey ${username}, one of your meetings just started: ${meeting.name}`,
      html: `<p>One of your meetings just started: ${meeting.name}</p>
      <p>Click <a href="https://meetingminder.dev/meeting/${meeting._id}/meet">here</a> to go to the meeting page.</p>`,
    };
  },
};
