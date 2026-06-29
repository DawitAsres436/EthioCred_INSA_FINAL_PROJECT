const crypto = require('crypto');

function verifySignature(canonicalString, signatureBase64, publicKeyPem) {
  try {
    const verify = crypto.createVerify('RSA-SHA256');
    verify.update(canonicalString);
    return verify.verify(publicKeyPem, signatureBase64, 'base64');
  } catch {
    return false;
  }
}

module.exports = { verifySignature };
