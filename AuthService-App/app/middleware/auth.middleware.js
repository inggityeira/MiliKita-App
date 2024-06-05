const jwt = require('jsonwebtoken');
const authController = require('../controllers/auth.controller');
const JWT_SECRET = 'your_jwt_secret_key';

module.exports = (req, res, next) => {
  // Ambil token dari header
  const token = req.header('Authorization').replace('Bearer ', '');

  // Periksa apakah token ada
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
