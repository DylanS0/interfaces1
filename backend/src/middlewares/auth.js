const { verifyAccessToken } = require('../utils/jwt');

function parseBearerToken(header) {
  if (!header) {
    return null;
  }
  const [type, token] = header.split(' ');
  if (type !== 'Bearer' || !token) {
    return null;
  }
  return token;
}

function requireAuth(req, _res, next) {
  try {
    const token = parseBearerToken(req.headers.authorization);
    if (!token) {
      const err = new Error('Unauthorized');
      err.status = 401;
      throw err;
    }

    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role
    };

    return next();
  } catch (_err) {
    const err = new Error('Unauthorized');
    err.status = 401;
    return next(err);
  }
}

function requireRole(...allowedRoles) {
  return (req, _res, next) => {
    if (!req.user) {
      const err = new Error('Unauthorized');
      err.status = 401;
      return next(err);
    }

    if (!allowedRoles.includes(req.user.role)) {
      const err = new Error('Forbidden');
      err.status = 403;
      return next(err);
    }

    return next();
  };
}

module.exports = { requireAuth, requireRole };
