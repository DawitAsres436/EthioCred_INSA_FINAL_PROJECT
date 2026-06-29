const crypto = require('crypto');
const { canonicalize } = require('./hash');

function signCredential(payload, privateKey) {
  const data = typeof payload === 'string' ? payload : canonicalize(payload);
  const signature = crypto.sign('sha256', Buffer.from(data), {
    key: privateKey,
    padding: crypto.constants.RSA_PKCS1_PADDING,
  });
  return signature.toString('base64');
}

module.exports = { signCredential };
