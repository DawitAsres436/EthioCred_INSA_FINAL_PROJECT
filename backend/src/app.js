const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const corsMiddleware = require('./config/cors');
const { error } = require('./utils/apiResponse');

const app = express();

app.use(helmet());
app.use(corsMiddleware);
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'EthioCred API is running.' });
});

app.use((_req, res) => {
  error(res, 'Route not found.', 'NOT_FOUND', 404);
});

app.use((err, _req, res, _next) => {
  console.error(err);
  error(res, 'Internal server error.', 'INTERNAL_ERROR', 500);
});

module.exports = app;
