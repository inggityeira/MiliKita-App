const express = require("express");
const app = express();

const connectDB = require("./app/config/database");
const menuRoutes = require("./app/routes/menu.routes");
const menuController = require("./app/controllers/menu.controller");
const PORT = process.env.PORT || 5001;

// register middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// connect database dan port
connectDB();

// membuat routes
app.use("/", menuRoutes);

// Port
menuController.connectRabbitMQ().then(() => {
  app.listen(PORT, () => {
    console.log(`😀 server on port ${PORT}`);
  });
});
