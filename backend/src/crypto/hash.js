const crypto = require('crypto');

function canonicalize(payload) {
  const sorted = Object.keys(payload)
    .sort()
    .reduce((acc, key) => {
      acc[key] = payload[key];
      return acc;
    }, {});
  return JSON.stringify(sorted);
}

function hashCredential(payload) {
  const canonical = typeof payload === 'string' ? payload : canonicalize(payload);
  return crypto.createHash('sha256').update(canonical, 'utf8').digest('hex');
}

module.exports = { canonicalize, hashCredential };
