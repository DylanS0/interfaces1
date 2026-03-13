const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { apiRouter } = require('./routes');
const { notFound } = require('./middlewares/notFound');
const { errorHandler } = require('./middlewares/errorHandler');
const { env } = require('./config/env');

const app = express();

app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.get('/', (_req, res) => {
  res.status(200).json({ success: true, message: 'Theme Customizer API' });
});

app.use('/api', apiRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = { app };
