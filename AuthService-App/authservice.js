const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./app/routes/auth.routes');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

// MongoDB Connection
const dbURI = "mongodb+srv://tsnalauralailla:PyReSmwOpwIR0YMG@authservicemilikitadb.cnhjfae.mongodb.net/?retryWrites=true&w=majority&appName=AuthServiceMiliKitaDB";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to database!'))
    .catch((error) => console.error('Connection failed! Reason:', error));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Set EJS as templating engine
app.set('view engine', 'ejs');

// Static folder
// app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', authRoutes);

// JWT Secret Key
const JWT_SECRET = 'your-secret-key';

// Middleware to verify JWT token from cookie
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send('Unauthorized: No token provided');
    }
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send('Unauthorized: Invalid token');
        }
        req.user = decoded;
        next();
    });
};

// Example protected route
app.get('/protected', verifyToken, (req, res) => {
    res.send('Authorized');
});

app.get('/', (req, res) => {
    res.render('index');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).send('Server error');
});

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
