const jwt = require('jsonwebtoken');
<<<<<<< HEAD
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
=======
const { isTokenBlacklisted } = require('../controllers/auth.controller');
const { user } = require('../models/auth.model');
const { JWT_SECRET, REFRESH_TOKEN_SECRET } = require('../config');

const authenticateToken = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            return res.status(401).json({ message: 'No access token provided' });
        }

        const decodedAccessToken = jwt.verify(accessToken, JWT_SECRET);
        req.user = decodedAccessToken.user;
        next();
    } catch (error) {
        console.error(error.message);
        return res.status(403).json({ message: 'Invalid access token' });
    }
};

const authenticateRefreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: 'No refresh token provided' });
        }

        const decodedRefreshToken = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        req.user = decodedRefreshToken.user;

        if (isTokenBlacklisted(refreshToken)) {
            return res.status(403).json({ message: 'Refresh token is blacklisted' });
        }

        const user = await User.findById(req.prams.id);
        if (!user) {
            return res.status(403).json({ message: 'User associated with the refresh token does not exist' });
        }

        next();
    } catch (error) {
        console.error(error.message);
        return res.status(403).json({ message: 'Invalid refresh token' });
    }
};

module.exports = { authenticateToken, authenticateRefreshToken };
>>>>>>> 4f7e013c4ec5c26b23b5b167d14a2169e31f880c
