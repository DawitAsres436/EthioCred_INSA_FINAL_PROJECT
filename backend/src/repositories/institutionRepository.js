const { query } = require('../config/database');

async function findById(id) {
  const result = await query('SELECT * FROM institutions WHERE id = $1', [id]);
  return result.rows[0] || null;
}

async function findByName(name) {
  const result = await query('SELECT * FROM institutions WHERE name = $1', [name]);
  return result.rows[0] || null;
}

async function getAllInstitutions() {
  const result = await query('SELECT * FROM institutions ORDER BY name');
  return result.rows;
}

async function getActiveInstitutions() {
  const result = await query(
    `SELECT * FROM institutions WHERE status = 'ACTIVE' ORDER BY name`
  );
  return result.rows;
}

async function updateStatus(id, status, approvedBy = null) {
  const result = await query(
    `UPDATE institutions
     SET status = $2,
         approved_by = COALESCE($3, approved_by),
         approved_at = CASE WHEN $3 IS NOT NULL THEN CURRENT_TIMESTAMP ELSE approved_at END,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING *`,
    [id, status, approvedBy]
  );
  return result.rows[0] || null;
}

async function createInstitution({ name, organization_fayda_id, registration_number }) {
  const result = await query(
    `INSERT INTO institutions (name, organization_fayda_id, registration_number)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, organization_fayda_id, registration_number]
  );
  return result.rows[0];
}

async function saveKeyPair(institutionId, publicKey, encryptedPrivateKey, fingerprint) {
  const result = await query(
    `INSERT INTO institution_keys (institution_id, public_key, private_key_encrypted, fingerprint)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [institutionId, publicKey, encryptedPrivateKey, fingerprint]
  );
  return result.rows[0];
}

async function getActivePublicKey(institutionId) {
  const result = await query(
    `SELECT public_key FROM institution_keys
     WHERE institution_id = $1 AND status = 'ACTIVE'
     ORDER BY key_version DESC
     LIMIT 1`,
    [institutionId]
  );
  return result.rows[0]?.public_key || null;
}

async function getActiveInstitutionsWithPublicKeys() {
  const result = await query(
    `SELECT DISTINCT ON (i.id)
       i.id,
       i.name,
       i.organization_fayda_id,
       i.registration_number,
       i.status,
       k.public_key,
       k.fingerprint
     FROM institutions i
     INNER JOIN institution_keys k ON k.institution_id = i.id AND k.status = 'ACTIVE'
     WHERE i.status = 'ACTIVE'
     ORDER BY i.id, k.key_version DESC`
  );
  return result.rows;
}

module.exports = {
  findById,
  findByName,
  getAllInstitutions,
  getActiveInstitutions,
  updateStatus,
  createInstitution,
  saveKeyPair,
  getActivePublicKey,
  getActiveInstitutionsWithPublicKeys,
};
