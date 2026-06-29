const authService = require('../services/authService');
const auditService = require('../services/auditService');
const userRepository = require('../repositories/userRepository');
const { success, error } = require('../utils/apiResponse');

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return error(res, 'Email and password are required', 400);
  }

  const result = await authService.login(email, password);
  if (!result) {
    return error(res, 'Invalid email or password', 401);
  }

  await auditService.log({
    userId: result.user.id,
    action: auditService.USER_LOGIN,
    entityType: 'user',
    entityId: result.user.id,
    ipAddress: req.ip,
    details: { email: result.user.email },
  });

  return success(res, { token: result.token, user: result.user }, 'Login successful');
}

async function loginWithFayda(req, res) {
  const { fayda_id } = req.body;

  const result = await authService.loginWithFayda(fayda_id);
  if (!result) {
    return error(res, 'Student not found', 404);
  }

  return success(res, { token: result.token, user: result.user }, 'Login successful');
}

async function logout(req, res) {
  await auditService.log({
    userId: req.user.id,
    action: auditService.USER_LOGOUT,
    entityType: 'user',
    entityId: req.user.id,
    ipAddress: req.ip,
    details: null,
  });

  return success(res, null, 'Logged out successfully');
}

async function getMe(req, res) {
  const user = await userRepository.findById(req.user.id);
  if (!user) {
    return error(res, 'User not found', 404);
  }

  const { password_hash, ...userWithoutPassword } = user;
  return success(res, userWithoutPassword, 'Success');
}

module.exports = {
  login,
  loginWithFayda,
  logout,
  getMe,
};
