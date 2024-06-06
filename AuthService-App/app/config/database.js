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


module.exports = connectDB;
