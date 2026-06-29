const { verifyToken } = require('../config/jwt');
const { error } = require('../utils/apiResponse');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return error(res, 'Unauthorized', 401);
  }

  const token = authHeader.slice(7);

  try {
    req.user = verifyToken(token);
    return next();
  } catch {
    return error(res, 'Unauthorized', 401);
  }
}

module.exports = authenticate;
