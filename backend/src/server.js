const app = require('./app');
const env = require('./config/env');

const server = app.listen(env.port, () => {
  console.log(`EthioCred API running on port ${env.port} [${env.nodeEnv}]`);
});

process.on('SIGTERM', () => server.close());
