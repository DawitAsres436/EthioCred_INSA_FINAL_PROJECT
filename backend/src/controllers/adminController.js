const { query } = require('../config/database');
const authService = require('../services/authService');
const institutionService = require('../services/institutionService');
const auditService = require('../services/auditService');
const { success, error } = require('../utils/apiResponse');

async function getAuditLogs(req, res) {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const pageSize = Math.min(Math.max(parseInt(req.query.pageSize, 10) || 25, 1), 100);
  const offset = (page - 1) * pageSize;

  const { action, userId, entityType, startDate, endDate } = req.query;

  const { rows, total } = await auditService.getFilteredLogs({
    action: action || null,
    userId: userId || null,
    entityType: entityType || null,
    startDate: startDate || null,
    endDate: endDate || null,
    limit: pageSize,
    offset,
  });

  return success(res, {
    logs: rows,
    total,
    page,
    pageSize,
  }, 'Audit logs retrieved successfully');
}

async function getAllUsers(req, res) {
  const result = await query(
    `SELECT id, full_name, email, fayda_id, role, institution_id, status, created_at, updated_at
     FROM users
     ORDER BY created_at DESC`
  );
  return success(res, result.rows, 'Users retrieved successfully');
}

async function getSystemStats(req, res) {
  const [users, credentials, institutions, verifications] = await Promise.all([
    query('SELECT COUNT(*)::int AS count FROM users'),
    query('SELECT COUNT(*)::int AS count FROM credentials'),
    query('SELECT COUNT(*)::int AS count FROM institutions'),
    query('SELECT COUNT(*)::int AS count FROM verification_requests'),
  ]);

  return success(res, {
    users: users.rows[0].count,
    credentials: credentials.rows[0].count,
    institutions: institutions.rows[0].count,
    verifications: verifications.rows[0].count,
  }, 'System stats retrieved successfully');
}

async function createAdmin(req, res) {
  const { full_name, email, password } = req.body;

  if (!full_name || !email || !password) {
    return error(res, 'All fields are required', 400);
  }

  try {
    const newAdmin = await authService.createAdmin({ full_name, email, password }, req.user.id);
    return success(res, newAdmin, 'Admin account created', 201);
  } catch (err) {
    if (
      err.message === 'This email is already registered' ||
      err.message === 'Password must be at least 8 characters'
    ) {
      return error(res, err.message, 409);
    }
    throw err;
  }
}

async function getPendingInstitutions(req, res) {
  const institutions = await institutionService.getPendingInstitutions();
  return success(res, institutions, 'Pending institutions retrieved successfully');
}

async function getAllInstitutionsAdmin(req, res) {
  const institutions = await institutionService.getAllInstitutionsWithRegistrarCounts();
  return success(res, institutions, 'Institutions retrieved successfully');
}

module.exports = {
  getAuditLogs,
  getAllUsers,
  getSystemStats,
  createAdmin,
  getPendingInstitutions,
  getAllInstitutionsAdmin,
};
