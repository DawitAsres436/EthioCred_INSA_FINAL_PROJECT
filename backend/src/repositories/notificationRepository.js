const { query } = require('../config/database');

async function createNotification({ userId, type, message }, client = null) {
  const db = client || { query };
  const result = await db.query(
    `INSERT INTO notifications (user_id, type, message)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, type, message]
  );
  return result.rows[0];
}

async function findByUserId(userId) {
  const result = await query(
    `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
}

async function markAsRead(id) {
  const result = await query(
    `UPDATE notifications SET is_read = TRUE WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0] || null;
}

async function markAllAsRead(userId) {
  const result = await query(
    `UPDATE notifications SET is_read = TRUE WHERE user_id = $1 AND is_read = FALSE RETURNING *`,
    [userId]
  );
  return result.rows;
}

module.exports = {
  createNotification,
  findByUserId,
  markAsRead,
  markAllAsRead,
};
