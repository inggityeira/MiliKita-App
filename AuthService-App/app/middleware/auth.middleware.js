const jwt = require('jsonwebtoken');
const authController = require('../controllers/auth.controller');
const { JWT_SECRET } = require('../config/database');

const authToken = async (req, res, next) => {
  try {
    // Check for token in Authorization header
    const authHeader = req.header('Authorization');
    let token;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else {
      // Check for token in cookies if not found in Authorization header
      token = req.cookies.authToken;
    }

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    if (authController.isTokenBlacklisted(token)) {
      return res.status(401).json({ message: 'Token is blacklisted' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authToken;
