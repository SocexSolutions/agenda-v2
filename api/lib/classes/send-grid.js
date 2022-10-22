const templates = require("./emailTemplates/templates");
const sgMail = require("@sendgrid/mail");

class SendGrid {
  #sendGrid;

  constructor(opts) {
    this.apiKey = opts.key;

    this.defaultEmail = opts.defaultEmail;

    sgMail.setAPIKey(this.apiKey);
    this.#sendGrid = sgMail;
  }

  /**
   *
   * @param {string} recipients recipient email
   * @param {object} message sendgrid template object
   */
  sendMessage(recipients, message) {
    this.#sendGrid.send({
      to: recipients,
      from: this.defaultEmail,
      message,
    });
  }

  sendWelcomeEmail(username, email) {
    const welcomeEmail = new templates.WelcomeEmail(username);

    this.sendMessage(email, welcomeEmail);
  }
}

export default SendGrid;
