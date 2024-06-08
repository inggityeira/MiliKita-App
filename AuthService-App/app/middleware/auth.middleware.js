const jwt = require('jsonwebtoken');
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
