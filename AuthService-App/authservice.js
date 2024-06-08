const express = require('express');
const authRoutes = require('./app/routes/auth.routes');
const cookieParser = require('cookie-parser');
const connectDB = require("./app/config/database");

const app = express();

// MongoDB Connection
connectDB();

//middleware
app.use(express.json());
app.use(cookieParser());

//membuat routes
app.use('/', authRoutes);

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));