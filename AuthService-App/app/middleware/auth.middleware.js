const jwt = require('jsonwebtoken');
const authController = require('../controllers/auth.controller');
const JWT_SECRET = 'your_jwt_secret_key';
const cookieParser = require('cookie-parser');

module.exports = async (req, res, next) => {
  try {
    // Ambil token dari header
    const authHeader = req.header('Authorization');

    // Periksa apakah token ada di header dan memiliki format yang benar
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Pisahkan token dari kata 'Bearer'
    const token = authHeader.split(' ')[1];

    // Periksa apakah token ada
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Periksa apakah token di blacklist
    if (authController.isTokenBlacklisted(token)) {
      return res.status(401).json({ message: 'Token is blacklisted' });
    }

    // Verifikasi token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }

  app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).send('Server error');
});

};

