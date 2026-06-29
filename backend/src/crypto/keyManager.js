const crypto = require('crypto');
const { query } = require('../config/database');
require('../config/env');

function getAesKey() {
  const key = process.env.AES_ENCRYPTION_KEY;
  if (!key || key.length !== 32) {
    throw new Error('AES_ENCRYPTION_KEY must be exactly 32 characters');
  }
  return Buffer.from(key, 'utf8');
}

function generateRSAKeyPair() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });
  return { publicKey, privateKey };
}

function encryptPrivateKey(privateKeyPem) {
  const key = getAesKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  let encrypted = cipher.update(privateKeyPem, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();

  return JSON.stringify({
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
    encryptedKey: encrypted,
  });
}

function decryptPrivateKey(encryptedJson) {
  const { iv, authTag, encryptedKey } = JSON.parse(encryptedJson);
  const key = getAesKey();
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'hex'));
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));

  let decrypted = decipher.update(encryptedKey, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

async function loadPrivateKey(institutionId) {
  const result = await query(
    `SELECT private_key_encrypted FROM institution_keys
     WHERE institution_id = $1 AND status = 'ACTIVE'
     ORDER BY key_version DESC
     LIMIT 1`,
    [institutionId]
  );

  if (result.rows.length === 0) {
    throw new Error(`No active private key found for institution ${institutionId}`);
  }

  return decryptPrivateKey(result.rows[0].private_key_encrypted);
}

function generateKeyFingerprint(publicKeyPem) {
  return crypto.createHash('sha256').update(publicKeyPem).digest('hex');
}

module.exports = {
  generateRSAKeyPair,
  encryptPrivateKey,
  decryptPrivateKey,
  loadPrivateKey,
  generateKeyFingerprint,
};
