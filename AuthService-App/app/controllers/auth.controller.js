const User = require('../models/auth.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

const JWT_SECRET = 'your_jwt_secret_key';
const tokenBlacklist = new Set();


// Fungsi untuk memeriksa apakah token di-blacklist
const isTokenBlacklisted = (token) => {
    return tokenBlacklist.has(token);
};

// Fungsi untuk menambahkan token ke dalam blacklist
const blacklistToken = (token) => {
    tokenBlacklist.add(token);
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

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id_user: req.params.id
            }
        };

        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.cookie('authToken', token, { httpOnly: true, secure: true, sameSite: 'Strict' });
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Authorization User
exports.getUser = async (req, res) => {
    try {
        // Periksa apakah ID pengguna yang diberikan valid
        if (!req.params.id) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Cari pengguna berdasarkan ID yang diberikan
        const user = await User.findById(req.params.id).select('-password');
        
        // Periksa apakah pengguna ditemukan
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Berikan respons dengan data pengguna
        res.json(user);
    } catch (err) {
        console.error(err.message);
        // Berikan respons yang lebih informatif untuk kesalahan server
        res.status(500).json({ message: 'Failed to fetch user data. Please try again later.' });
    }
};

// Logout
exports.logout = (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    tokenBlacklist.push(token);
    res.status(200).json({ msg: 'Logged out successfully' });
};

// Export functions
exports.isTokenBlacklisted = isTokenBlacklisted;
exports.blacklistToken = blacklistToken;
