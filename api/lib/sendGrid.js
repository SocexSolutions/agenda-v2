const SendGrid = require( "../lib/classes/sendGrid" );

const key = API_KEY;



module.exports = new SendGrid({
  key,
  defaultEmail: "zachbarnes@socnet.org"
});

