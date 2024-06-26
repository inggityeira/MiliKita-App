const express = require('express')
const app = express()

const connectDB = require("./app/config/database");
const cabangRoutes = require('./app/routes/cabang.routes');
const cabangController = require('./app/controllers/cabang.Controller');
const PORT = process.env.PORT || 5002;

// register middleware
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// connect database dan port
connectDB();

// membuat routes
app.use('/', cabangRoutes);

// Port
cabangController.connectRabbitMQ().then(() => {
    app.listen(PORT, () => {
      console.log(`😀 server on port ${PORT}`);
    });
  });

