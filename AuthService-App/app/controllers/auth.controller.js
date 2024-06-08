const User = require('../models/auth.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult, body } = require('express-validator');

const JWT_SECRET = 'your_jwt_secret_key';
const REFRESH_TOKEN_SECRET = 'your_refresh_token_secret_key';
const tokenBlacklist = [];

const generateAccessToken = (user) => {
    return jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
};

const generateRefreshToken = (user) => {
    return jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: '1h' });
};

// Registration
exports.register = async (req,res) => {
    try {
        const existingemail = await User.findOne({email: req.body.email});
        if (existingemail){
            return res.status(400).send({message: "Email have been recorded!"});
        }
        if (req.body.password.length <= 6){
            return res.status(400).send({message: "Password must be 6 or more characters!"});
        } 
        const hashpassword = await bcrypt.hash(req.body.password, 10);
        
        const newUser = new User ({
            nama_lengkap: req.body.nama_lengkap,
            email: req.body.email,
            password: hashpassword,
        });

        const savedUser = await newUser.save();
        res.status(201).send(savedUser);

    } catch (error) {
        res.status(400).send(error);
    }
}

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

        const isMatch = await bcrypt.compare(password, hashpassword);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = { user: {id_user: req.params.id }};
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        // Pengaturan cookie
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            maxAge: 3600,
            sameSite: 'strict'
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 3600,
            sameSite: 'strict'
        });

        res.json({ accessToken, refreshToken });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Refresh Token
exports.refreshToken = (req, res) => {
    // Logika refresh token
    try {
        // Pengaturan token
        const payload = { user: { id_user: req.params.id  } };
        const accessToken = generateAccessToken(payload);

        // Pengaturan cookie
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            maxAge: 3600,
            sameSite: 'strict'
        });

        // Respon berhasil
        res.status(200).json({ accessToken });
    } catch (error) {
        // Tangani kesalahan
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

// Authorization User
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
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

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    register: exports.register,
    login: exports.login,
    refreshToken: exports.refreshToken,
    getUser: exports.getUser,
    logout: exports.logout,
    isTokenBlacklisted: exports.isTokenBlacklisted,
};
