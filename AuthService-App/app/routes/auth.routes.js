const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth.middleware');
const authController = require('../controllers/auth.controller');

console.log('authController:', authController);

//Register
router.post(
  '/register',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    console.log (errors)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    authController.register(req, res);
  }
);

//Login
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    authController.login(req, res);
  }
);

router.get('/user', auth, authController.getUser);

// Logout
router.post('/logout', auth, authController.logout);

module.exports = router;
