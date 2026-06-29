const { error } = require('../utils/apiResponse');

function authorize(...allowedRoles) {
  const normalizedRoles = allowedRoles.map((role) => role.toUpperCase());

  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return error(res, 'Forbidden - insufficient permissions', 403);
    }

    if (!normalizedRoles.includes(req.user.role.toUpperCase())) {
      return error(res, 'Forbidden - insufficient permissions', 403);
    }

    return next();
  };
}

module.exports = authorize;
