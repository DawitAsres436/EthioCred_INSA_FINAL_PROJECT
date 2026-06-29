const { logger } = require('./logger');
const { error } = require('../utils/apiResponse');

function errorHandler(err, req, res, next) {
  logger.error(err.message || 'Internal server error', { stack: err.stack });
  return error(res, err.message || 'Internal server error', err.statusCode || 500);
}

module.exports = errorHandler;
