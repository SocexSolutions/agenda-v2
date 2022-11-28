let baseUrl;

// istanbul ignore next
if (process.env.NODE_ENV === "production") {
  baseUrl = "https://meetingminder.dev";
} else {
  baseUrl = "http://localhost:3000";
}

module.exports = {
  buildWelcomeEmail(username) {
    return {
      subject: "Welcome to MeetingMinder!",
      text: `Welcome to MeetingMinder, ${username}!`,
      html: `<p>Welcome to MeetingMinder, ${username}!</p>`,
    };
  },
  buildVoteEmail(username, meeting) {
    const voteUrl = `${baseUrl}/meeting/${meeting._id}/vote`;

    return {
      subject: "MeetingMinder Voting Invite",
      text: `Hey ${username}, have been invited to vote on a meeting: ${meeting.name}`,
      html: `<p>You have been invited to vote on a meeting: ${meeting.name}</p>
      <p>Click <a href="${voteUrl}">here</a> to go to the voting page.</p>`,
    };
  },
  buildReminderEmail(username, meeting) {
    const meetUrl = `${baseUrl}/meeting/${meeting._id}/meet`;

    return {
      subject: "MeetingMinder Meeting Started",
      text: `Hey ${username}, one of your meetings just started: ${meeting.name}`,
      html: `<p>One of your meetings just started: ${meeting.name}</p>
      <p>Click <a href="${meetUrl}">here</a> to go to the meeting page.</p>`,
    };
  },
  buildPasswordResetEmail({ username, userId, resetCode }) {
    const resetUrl = `${baseUrl}/reset-password?userId=${userId}&code=${resetCode}`;

    return {
      subject: "MeetingMinder Password Reset",
      text: `Hey ${username}, you have requested a password reset. Click the link below to reset your password: ${resetUrl}`,
      html: `<p>Hey ${username}, you have requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    };
  },
};
