const User = require('../models/auth.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

const JWT_SECRET = '6f8a8e7c8a9b1c4a2e4d8e8f6c8b9a1c2d4f6a7b9c8d4f1e2a7b9c8d4f1e2a3b9c8d4f1e2a3b9c8d4f1e2a3'; 
const tokenBlacklist = [];

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
                id_user: user.id
            }
        };

        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: 3600 },
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

    // Authorization User
//     exports.getUser = async (req, res) => {
//         try {
//             // console.log(req.headers.authorization)
//             // const key = req.headers.authorization.split(" ")[1]
//             // console.log(key)

//             jwt.verify(key, JWT_SECRET, (err, decoded) => {
//                 if (err){
//                     console.log(err)
//                     res.status(500).send(err)
//                 }

//                 else {
//                     console.log('Verified', decoded)
//                     res.status(200).send(decoded)
//                 }
//             })
//         //signdanverifikasi pake token yang sama
//         // const key= req.header.authorization
//         // yang dimasukin ke jwt.decodenya itu tokennya aja
//         // const user = await User.findById(req.user.id).select('-password');
//         // res.json(user);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server error');
//     }
// };

exports.getUser = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; // Ambil token dari header authorization
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error(err);
                return res.status(401).json({ message: 'Token invalid' }); // Unauthorized jika token tidak valid
            } else {
                console.log('Verified', decoded);
                return res.status(200).json(decoded); // Kirim data yang telah didecode
            }
        });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
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
