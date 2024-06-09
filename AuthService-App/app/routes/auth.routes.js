const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/register', authController.register);
router.post('/login', authController.login);
<<<<<<< HEAD
router.get('/protected', authController.getUser);
=======
router.get('/ownerkita', authenticateToken, authenticateRefreshToken, authController.getUser);
>>>>>>> 4f7e013c4ec5c26b23b5b167d14a2169e31f880c
router.put('/logout', authController.logout);

module.exports = router;
