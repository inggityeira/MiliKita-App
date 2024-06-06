const express = require('express');
const app = express();

const connectDB = require('./app/config/database');
const reviewRoutes = require('./app/routes/review.routes');
const reviewController = require('./app/controllers/review.controller');
const PORT = process.env.PORT || 5000;

// register middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// connect database dan port
connectDB();

// menggunakan routes
app.use('/', reviewRoutes);

// Port
reviewController.connectRabbitMQ().then(() => {
  app.listen(PORT, () => {
    console.log(`😀 server on port ${PORT}`);
  });
});
