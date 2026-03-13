const { findByEmail, findById, createUser } = require('../users/users.repo');
const {
  saveRefreshToken,
  findValidRefreshToken,
  revokeRefreshTokenByHash
} = require('./auth.repo');
const { hashPassword, comparePassword } = require('../../utils/password');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken
} = require('../../utils/jwt');

function toPublicUser(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role
  };
}

function computeRefreshExpiryDate() {
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  return new Date(Date.now() + sevenDays);
}

async function register({ email, password }) {
  const existing = await findByEmail(email);
  if (existing) {
    const err = new Error('Email already registered');
    err.status = 409;
    throw err;
  }

  const passwordHash = await hashPassword(password);
  const user = await createUser({ email, passwordHash, role: 'client' });
  return toPublicUser(user);
}

async function login({ email, password }) {
  const user = await findByEmail(email);
  if (!user) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  const valid = await comparePassword(password, user.password_hash);
  if (!valid) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  const payload = { sub: user.id, email: user.email, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  const refreshTokenHash = hashToken(refreshToken);
  const refreshExpiresAt = computeRefreshExpiryDate();

  await saveRefreshToken({
    userId: user.id,
    tokenHash: refreshTokenHash,
    expiresAt: refreshExpiresAt
  });

  return {
    user: toPublicUser(user),
    accessToken,
    refreshToken
  };
}

async function refresh(refreshToken) {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (_err) {
    const err = new Error('Invalid refresh token');
    err.status = 401;
    throw err;
  }

  const refreshTokenHash = hashToken(refreshToken);
  const tokenRow = await findValidRefreshToken(refreshTokenHash);
  if (!tokenRow) {
    const err = new Error('Refresh token expired or revoked');
    err.status = 401;
    throw err;
  }

  await revokeRefreshTokenByHash(refreshTokenHash);

  const user = await findById(payload.sub);
  if (!user) {
    const err = new Error('User not found');
    err.status = 401;
    throw err;
  }

  const newPayload = { sub: user.id, email: user.email, role: user.role };
  const newAccessToken = signAccessToken(newPayload);
  const newRefreshToken = signRefreshToken(newPayload);
  const newRefreshHash = hashToken(newRefreshToken);
  const refreshExpiresAt = computeRefreshExpiryDate();

  await saveRefreshToken({
    userId: user.id,
    tokenHash: newRefreshHash,
    expiresAt: refreshExpiresAt
  });

  return {
    user: toPublicUser(user),
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  };
}

async function logout(refreshToken) {
  if (!refreshToken) {
    return;
  }

  const tokenHash = hashToken(refreshToken);
  await revokeRefreshTokenByHash(tokenHash);
}

async function me(userId) {
  const user = await findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }

  return toPublicUser(user);
}

module.exports = { register, login, refresh, logout, me };
