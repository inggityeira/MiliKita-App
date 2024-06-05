const User = require('../models/auth.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

// Define JWT Secret here
const JWT_SECRET = 'your_jwt_secret_key';

// In-memory blacklist, for production use a database or Redis
const tokenBlacklist = [];

// Registration
exports.register = async (req, res) => {
    const { id_user, nama_karyawan, email, password } = req.body;

    console.log("Request body:", req.body); // Log request body
    
    // Input validation
    await check('email', 'Please include a valid email').isEmail().run(req);
    await check('password', 'Password must be 6 or more characters').isLength({ min: 6 }).run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            id_user,
            nama_karyawan,
            email,
            password
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: 30 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Input validation
    await check('email', 'Please include a valid email').isEmail().run(req);
    await check('password', 'Password is required').exists().run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: 30 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get User
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Logout
exports.logout = (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    tokenBlacklist.push(token);
    res.status(200).json({ msg: 'Logged out successfully' });
};

// Check if token is blacklisted
exports.isTokenBlacklisted = (token) => {
    return tokenBlacklist.includes(token);
};
