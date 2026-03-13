const { query } = require('../../db/pool');

async function findByEmail(email) {
  const sql = `
    SELECT id, email, password_hash, role, created_at, updated_at
    FROM users
    WHERE lower(email) = lower($1)
    LIMIT 1
  `;
  const result = await query(sql, [email]);
  return result.rows[0] || null;
}

async function findById(id) {
  const sql = `
    SELECT id, email, role, created_at, updated_at
    FROM users
    WHERE id = $1
    LIMIT 1
  `;
  const result = await query(sql, [id]);
  return result.rows[0] || null;
}

async function createUser({ email, passwordHash, role }) {
  const sql = `
    INSERT INTO users (email, password_hash, role)
    VALUES (lower($1), $2, $3)
    RETURNING id, email, role, created_at, updated_at
  `;
  const result = await query(sql, [email, passwordHash, role]);
  return result.rows[0];
}

module.exports = { findByEmail, findById, createUser };
