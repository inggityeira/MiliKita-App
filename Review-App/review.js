const express = require('express')
const app = express()
const cors = require("cors")
const connectDB = require('./app/config/database');
const reviewRoutes = require('./app/routes/review.routes');
const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: "*"
};

// register cors middleware
app.use(cors(corsOptions));
app.use(express.json());

// connect database dan port
connectDB();

// membuat routes
app.use('/', reviewRoutes);

// Port
app.listen(PORT, () => {
    console.log(`😀 server on port ${PORT}`);
});

