const express = require('express');
const authController = require('../modules/auth/auth.controller');
const { requireAuth } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get('/me', requireAuth, authController.me);

module.exports = { authRouter: router };
