const crypto = require('crypto');

function signCredential(canonicalString, privateKeyPem) {
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(canonicalString);
  return sign.sign(privateKeyPem, 'base64');
}

module.exports = { signCredential };
