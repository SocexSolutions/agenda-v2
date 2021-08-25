const crypto = require( "crypto" );
const fs     = require( "fs" );

/**
 * Generates a public private key pair to be used by the app.
 */
function generateKeyPair() {
  console.log( "generating keys...\n" );

  const keyPair = crypto.generateKeyPairSync( "rsa", {
    modulusLength: 4096, // length of key size (4096 is standard)
    publicKeyEncoding: {
      type: "pkcs1", // public key crypography standards 1
      format: "pem"
    },
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem"
    }
  });

  fs.writeFileSync( __dirname + "/../id_rsa_pub.pem", keyPair.publicKey );
  fs.writeFileSync( __dirname + "/../id_rsa_priv.pem", keyPair.privateKey );
}

generateKeyPair();