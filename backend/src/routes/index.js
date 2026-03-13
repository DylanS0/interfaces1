const express = require('express');
const { authRouter } = require('./auth.routes');
const { requireAuth, requireRole } = require('../middlewares/auth');

const router = express.Router();

router.get('/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'API is healthy' });
});

router.use('/auth', authRouter);

router.get('/admin/ping', requireAuth, requireRole('admin'), (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'Admin endpoint reachable',
      user: req.user
    }
  });
});

module.exports = { apiRouter: router };
