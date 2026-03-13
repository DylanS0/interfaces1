const { Pool } = require('pg');
const { env } = require('../config/env');

const pool = new Pool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  max: 10
});

async function query(text, params = []) {
  return pool.query(text, params);
}

async function healthCheck() {
  const result = await query('SELECT 1 as ok');
  return result.rows[0]?.ok === 1;
}

module.exports = { pool, query, healthCheck };
