const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to database!");
  } catch (error) {
    console.error("Connection failed! Reason:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
