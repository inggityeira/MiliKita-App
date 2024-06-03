const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose
    .connect("mongodb+srv://InggitYeira:5ELFWQukvW1cmWxC@reviewmilikitadb.e2hwzey.mongodb.net/MiliKita?retryWrites=true&w=majority&appName=ReviewMiliKitaDB")
    .then(() => {
      console.log("Connected to database!");
    })
    .catch((error) => {
      console.error("Connection failed! Reason:", error);
    });
};

module.exports = connectDB;
