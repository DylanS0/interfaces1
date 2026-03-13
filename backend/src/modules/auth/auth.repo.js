const { query } = require('../../db/pool');

async function saveRefreshToken({ userId, tokenHash, expiresAt }) {
  const sql = `
    INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
    VALUES ($1, $2, $3)
    RETURNING id, user_id, expires_at
  `;
  const result = await query(sql, [userId, tokenHash, expiresAt]);
  return result.rows[0];
}

async function findValidRefreshToken(tokenHash) {
  const sql = `
    SELECT id, user_id, token_hash, expires_at, revoked_at
    FROM refresh_tokens
    WHERE token_hash = $1
      AND revoked_at IS NULL
      AND expires_at > NOW()
    LIMIT 1
  `;
  const result = await query(sql, [tokenHash]);
  return result.rows[0] || null;
}

async function revokeRefreshTokenByHash(tokenHash) {
  const sql = `
    UPDATE refresh_tokens
    SET revoked_at = NOW()
    WHERE token_hash = $1
      AND revoked_at IS NULL
  `;
  await query(sql, [tokenHash]);
}

module.exports = {
  saveRefreshToken,
  findValidRefreshToken,
  revokeRefreshTokenByHash
};
