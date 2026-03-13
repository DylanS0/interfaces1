const { registerSchema, loginSchema } = require('./auth.schema');
const authService = require('./auth.service');

const REFRESH_COOKIE_NAME = 'refreshToken';

function refreshCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    sameSite: isProd ? 'none' : 'lax',
    secure: isProd,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/auth'
  };
}

async function register(req, res, next) {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      const err = new Error('Invalid payload');
      err.status = 422;
      err.details = parsed.error.flatten();
      throw err;
    }

    const user = await authService.register(parsed.data);
    return res.status(201).json({
      success: true,
      message: 'User created',
      data: { user }
    });
  } catch (err) {
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      const err = new Error('Invalid payload');
      err.status = 422;
      err.details = parsed.error.flatten();
      throw err;
    }

    const { user, accessToken, refreshToken } = await authService.login(parsed.data);

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions());

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { user, accessToken }
    });
  } catch (err) {
    return next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const refreshToken = req.cookies[REFRESH_COOKIE_NAME];
    if (!refreshToken) {
      const err = new Error('Refresh token missing');
      err.status = 401;
      throw err;
    }

    const { user, accessToken, refreshToken: nextRefreshToken } = await authService.refresh(refreshToken);

    res.cookie(REFRESH_COOKIE_NAME, nextRefreshToken, refreshCookieOptions());

    return res.status(200).json({
      success: true,
      message: 'Token refreshed',
      data: { user, accessToken }
    });
  } catch (err) {
    return next(err);
  }
}

async function logout(req, res, next) {
  try {
    const refreshToken = req.cookies[REFRESH_COOKIE_NAME];
    await authService.logout(refreshToken);

    res.clearCookie(REFRESH_COOKIE_NAME, {
      ...refreshCookieOptions(),
      maxAge: undefined
    });

    return res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (err) {
    return next(err);
  }
}

async function me(req, res, next) {
  try {
    const user = await authService.me(req.user.id);
    return res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { register, login, refresh, logout, me };
