const dotenv = require('dotenv');

dotenv.config();

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === null || value === '') {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

const env = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    host: required('DB_HOST', 'localhost'),
    port: Number(required('DB_PORT', '5432')),
    user: required('DB_USER', 'postgres'),
    password: required('DB_PASSWORD', '1234'),
    database: required('DB_NAME', 'theme_customizer')
  },
  jwt: {
    accessSecret: required('JWT_ACCESS_SECRET', 'dev_access_secret_change_me'),
    refreshSecret: required('JWT_REFRESH_SECRET', 'dev_refresh_secret_change_me'),
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173'
};

module.exports = { env };
