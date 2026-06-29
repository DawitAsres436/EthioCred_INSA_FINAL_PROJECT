const crypto = require('crypto');

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

console.log('EthioCred RSA Key Generator\n');
console.log('=== Public Key (PEM) ===');
console.log(publicKey);
console.log('=== Private Key (PEM) ===');
console.log(privateKey);
