const templates = require("./templates");
const sgMail = require("@sendgrid/mail");
const jobi = require("@starryinternet/jobi");

module.exports = class SendGrid {
  constructor(opts) {
    sgMail.setApiKey(opts.apiKey);

    this.defaultEmail = "meetingminderbot@meetingminder.dev";
    this.sendGrid = sgMail;
  }

  /**
   * Send a welcome email to a new user (errors are handled)
   * @param {string} email recipient email
   * @param {string} name recipient name
   */
  async sendWelcomeEmail(email, username) {
    try {
      await this.sendGrid.send({
        to: email,
        from: this.defaultEmail,
        ...templates.buildWelcomeEmail(username),
      });
    } catch (err) {
      jobi.error("Error sending welcome email", err);
    }
  }

  /**
   * Send an email letting a user know they can vote on a meeting
   * @param {string} email recipient email
   * @param {string} usrename recipient username
   * @param {object} meeting meeting object
   */
  async sendVoteEmail(email, username, meeting) {
    try {
      await this.sendGrid.send({
        to: email,
        from: this.defaultEmail,
        ...templates.buildVoteEmail(username, meeting),
      });
    } catch (err) {
      jobi.error("Error sending meeting vote email", err);
    }
  }

  /**
   * Send an email letting a user know they have a meeting has started
   * @param {string} email recipient email
   * @param {string} usrename recipient username
   * @param {object} meeting meeting object
   */
  async sendReminderEmail(email, username, meeting) {
    try {
      await this.sendGrid.send({
        to: email,
        from: this.defaultEmail,
        ...templates.buildReminderEmail(username, meeting),
      });
    } catch (err) {
      jobi.error("Error sending meeting reminder email", err);
    }
  }
};
