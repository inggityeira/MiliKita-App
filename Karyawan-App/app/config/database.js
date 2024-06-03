const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose
    .connect("mongodb+srv://tsnalauralailla:Mq0qgcfhXVtpB9sX@karyawanmilikitadb.6clype1.mongodb.net/MiliKita?retryWrites=true&w=majority&appName=KaryawanMiliKitaDB")
    .then(() => {
      console.log("Connected to database!");
    })
    .catch((error) => {
      console.error("Connection failed! Reasom:", error);
    });
};

module.exports = connectDB;
