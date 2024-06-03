const express = require('express')
const app = express()

const connectDB = require('./app/config/database');
const menuRoutes = require('./app/routes/menu.routes');
const PORT = process.env.PORT || 5001;


// register middleware
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// connect database dan port
connectDB();

// membuat routes
app.use('/', menuRoutes);

// Port
app.listen(PORT, () => {
    console.log(`😀 server on port ${PORT}`);
});

