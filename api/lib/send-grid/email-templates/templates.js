module.exports = {
  WelcomeEmail(firstName) {
    this.name = firstName;
    this.subject = "Welcome to Agenda";
    this.text = `Hi ${firstName}, Thank you for signing up for Agenda`;
    this.html = `<h1>Hi, ${firstName}, Thank you for signing up for Agenda`;
  },
};
