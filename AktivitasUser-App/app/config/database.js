const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose
    .connect("mongodb+srv://InggitYeira:eOkzQhRahmZ6C0b2@aktivitasuser.ekbsvg9.mongodb.net/MiliKita?retryWrites=true&w=majority&appName=AktivitasUser")
    .then(() => {
      console.log("Connected to database!");
    })
    .catch((error) => {
      console.error("Connection failed! Reason:", error);
    });
};

module.exports = connectDB;
