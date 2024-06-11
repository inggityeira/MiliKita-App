const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const connectDB = require("./app/config/database");
const authRoutes = require('./app/routes/auth.routes');

const app = express();

// MongoDB Connection
connectDB();

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

//membuat routes
app.use('/', authRoutes);
app.get('/protected', (req, res) => {
    res.send('Halaman yang dilindungi');
})

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));