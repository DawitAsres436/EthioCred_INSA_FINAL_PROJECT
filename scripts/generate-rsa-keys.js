const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'keys');

function generateKeyPair(institutionSlug) {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });

  const fingerprint = crypto
    .createHash('sha256')
    .update(publicKey)
    .digest('hex');

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const pubPath = path.join(OUTPUT_DIR, `${institutionSlug}-public.pem`);
  const privPath = path.join(OUTPUT_DIR, `${institutionSlug}-private.pem`);

  fs.writeFileSync(pubPath, publicKey);
  fs.writeFileSync(privPath, privateKey, { mode: 0o600 });

  console.log(`Generated RSA-2048 key pair for "${institutionSlug}":`);
  console.log(`  Public key:  ${pubPath}`);
  console.log(`  Private key: ${privPath}`);
  console.log(`  Fingerprint: ${fingerprint}`);
  console.log('');
}

console.log('EthioCred RSA Key Generator\n');

generateKeyPair('aau');
generateKeyPair('astu');

console.log('Keys saved to ./keys/ — never commit private keys to version control.');
