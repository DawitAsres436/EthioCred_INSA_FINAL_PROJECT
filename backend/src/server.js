const app = require('./app');
const { query } = require('./config/database');
require('./config/env');

const PORT = parseInt(process.env.PORT, 10) || 5000;

async function start() {
  try {
    await query('SELECT 1');
  } catch (err) {
    console.error('Failed to connect to PostgreSQL:', err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`EthioCred Backend running on port ${PORT}`);
  });
}

start();
