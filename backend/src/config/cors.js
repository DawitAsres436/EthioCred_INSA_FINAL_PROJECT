const cors = require('cors');
const env = require('./env');

module.exports = cors({
  origin: env.corsOrigins,
  credentials: true,
});
