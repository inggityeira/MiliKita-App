const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/ownerkita', authController.getUser);
router.put('/logout', authController.logout);
router.post('/refreshtoken', authController.refreshToken);

module.exports = router;