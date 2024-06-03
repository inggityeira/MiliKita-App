const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose
    .connect("mongodb+srv://InggitYeira:mggxyjWUUP5lZsJX@reviewmilikitadb.e2hwzey.mongodb.net/MiliKita?retryWrites=true&w=majority&appName=ReviewMiliKitaDB")
    .then(() => {
      console.log("Connected to database!");
    })
    .catch(() => {
      console.log("Connection failed!");
    });
};

module.exports = connectDB;