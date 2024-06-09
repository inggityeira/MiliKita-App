const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose
    .connect("mongodb+srv://tsnalauralailla:PyReSmwOpwIR0YMG@authservicemilikitadb.cnhjfae.mongodb.net/MiliKita?retryWrites=true&w=majority&appName=AuthServiceMiliKitaDB")
    .then(() => {
      console.log("Connected to database!");
    })
    .catch((error) => {
      console.error("Connection failed! Reasom:", error);
    });
};

const JWT_SECRET = '6f8a8e7c8a9b1c4a2e4d8e8f6c8b9a1c2d4f6a7b9c8d4f1e2a7b9c8d4f1e2a3b9c8d4f1e2a3b9c8d4f1e2a3'; 

module.exports = connectDB, JWT_SECRET;
