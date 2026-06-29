const crypto = require('crypto');
const { canonicalize } = require('./hash');

function verifySignature(payload, signature, publicKey) {
  const data = typeof payload === 'string' ? payload : canonicalize(payload);
  return crypto.verify(
    'sha256',
    Buffer.from(data),
    { key: publicKey, padding: crypto.constants.RSA_PKCS1_PADDING },
    Buffer.from(signature, 'base64')
  );
}

module.exports = { verifySignature };
