const { query } = require('../config/database');

async function findById(id, client = null) {
  const db = client || { query };
  const result = await db.query('SELECT * FROM credentials WHERE id = $1', [id]);
  return result.rows[0] || null;
}

async function findBySerialNumber(serial) {
  const result = await query('SELECT * FROM credentials WHERE serial_number = $1', [serial]);
  return result.rows[0] || null;
}

async function findByHolderId(userId) {
  const result = await query(
    `SELECT c.*, i.name AS institution_name
     FROM credentials c
     INNER JOIN institutions i ON i.id = c.institution_id
     WHERE c.holder_id = $1
     ORDER BY c.created_at DESC`,
    [userId]
  );
  return result.rows;
}

async function findByInstitutionId(institutionId, limit = 50, offset = 0) {
  const result = await query(
    `SELECT c.*, u.full_name AS holder_name
     FROM credentials c
     INNER JOIN users u ON u.id = c.holder_id
     WHERE c.institution_id = $1
     ORDER BY c.created_at DESC
     LIMIT $2 OFFSET $3`,
    [institutionId, limit, offset]
  );
  return result.rows;
}

async function createCredential(data, client = null) {
  const db = client || { query };
  const {
    serial_number,
    holder_id,
    institution_id,
    degree_name,
    major,
    graduation_year,
    gpa,
    issue_date,
    credential_hash,
    digital_signature,
    issued_by,
    credential_type = 'DEGREE',
  } = data;

  const result = await db.query(
    `INSERT INTO credentials (
       serial_number, holder_id, institution_id, credential_type,
       degree_name, major, graduation_year, gpa, issue_date,
       credential_hash, digital_signature, issued_by
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     RETURNING *`,
    [
      serial_number,
      holder_id,
      institution_id,
      credential_type,
      degree_name,
      major,
      graduation_year,
      gpa,
      issue_date,
      credential_hash,
      digital_signature,
      issued_by,
    ]
  );
  return result.rows[0];
}

async function updateStatus(id, status, client = null) {
  const db = client || { query };
  const result = await db.query(
    'UPDATE credentials SET status = $2 WHERE id = $1 RETURNING *',
    [id, status]
  );
  return result.rows[0] || null;
}

async function countByInstitutionId(institutionId) {
  const result = await query(
    'SELECT COUNT(*)::int AS count FROM credentials WHERE institution_id = $1',
    [institutionId]
  );
  return result.rows[0].count;
}

async function findWithDetails(id) {
  const result = await query(
    `SELECT
       c.*,
       u.full_name AS holder_name,
       u.email AS holder_email,
       u.fayda_id AS holder_fayda_id,
       i.name AS institution_name,
       i.status AS institution_status
     FROM credentials c
     INNER JOIN users u ON u.id = c.holder_id
     INNER JOIN institutions i ON i.id = c.institution_id
     WHERE c.id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

async function insertRevocation(credentialId, revokedBy, reason, client = null) {
  const db = client || { query };
  const result = await db.query(
    `INSERT INTO revoked_credentials (credential_id, revoked_by, reason)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [credentialId, revokedBy, reason]
  );
  return result.rows[0];
}

module.exports = {
  findById,
  findBySerialNumber,
  findByHolderId,
  findByInstitutionId,
  createCredential,
  updateStatus,
  countByInstitutionId,
  findWithDetails,
  insertRevocation,
};
