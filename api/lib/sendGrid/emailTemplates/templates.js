module.exports = {

  WelcomeEmail: function( firstName, recipiantEmail, senderEmail ) {
    this.name = firstName;
    this.to = recipiantEmail;
    this.from = senderEmail;
    this.subject = "Welcome to Agenda";
    this.text = `Hi ${firstName}, Thank you for signing up for Agenda`;
    this.html = `<h1>Hi, ${firstName}, Thank you for signing up for Agenda`;
  },

  WelcomeEmailtoo: function( firstName, recipiantEmail, senderEmail ) {
    this.name = firstName;
    this.to = recipiantEmail;
    this.from = senderEmail;
    this.subject = "test";
    this.text = `Hi ${firstName}, Thank you for signing up for Agenda`;
    this.html = `<h1>Hi, ${firstName}, Thank you for signing up for Agenda`;
  }

};