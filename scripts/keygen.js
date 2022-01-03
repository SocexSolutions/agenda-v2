const crypto = require('crypto');
const fs     = require('fs');

/**
 * Generates a public private key pair to be used by the app.
 */
function generateKeyPair() {
  console.log('Info: generating keys...\n');

  const keyPair = crypto.generateKeyPairSync( 'rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'pkcs1',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem'
    }
  });

  console.log('Info: keys created, writing to files...\n');

  try {
    fs.mkdirSync('./api/keys');
  } catch ( e ) {
    console.log('Warning: Failed to create keys directory\n');
  }

  fs.writeFileSync(
    './api/keys/id_rsa_pub.pem',
    keyPair.publicKey
  );

  fs.writeFileSync(
    './api/keys/id_rsa_priv.pem',
    keyPair.privateKey
  );

  console.log('Key generation successful.');
}

generateKeyPair();
