const crypto = require('crypto');

function canonicalize(credentialData) {
  const sorted = Object.keys(credentialData)
    .sort()
    .reduce((acc, key) => {
      acc[key] = credentialData[key];
      return acc;
    }, {});
  return JSON.stringify(sorted);
}

function hashCredential(canonicalString) {
  return crypto.createHash('sha256').update(canonicalString).digest('hex');
}

module.exports = { canonicalize, hashCredential };
