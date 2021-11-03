class SendGrid {
  #apiKey // this is a private property that will not be able to be accessed outside of this class definition

  constructor( opts ) {
    this.#apiKey = opts.key;

    this.defaultEmail = opts.defaultEmail;

    sgMail.setAPIKey( this.#apiKey );
    this.sendGrid = sgMail;
  }

  sendMessage( recipients, message ) {
    this.sendGrid.send({
      to: recipients,
      from: this.defaultEmail,
      message
    });
  }
}