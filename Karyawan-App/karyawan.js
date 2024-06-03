const express = require('express')
const app = express()


const connectDB = require("./app/config/database");
const karyawanRoutes = require('./app/routes/karyawan.routes')
const PORT = process.env.PORT || 5003;


// register middleware
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// connect database dan port
connectDB();

// membuat routes
app.use('/', karyawanRoutes);


// Port
app.listen(PORT, () => {
    console.log(`😀 server on port ${PORT}`);
});

