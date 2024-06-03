const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose
    .connect("mongodb+srv://nikitae372:g4YXA0I94qK1yYNg@menumilikitadb.t80ycbr.mongodb.net/MiliKita?retryWrites=true&w=majority&appName=MenuMiliKitaDB")
    .then(() => {
      console.log("Connected to database!");
    })
    .catch((error) => {
        console.error("Connection failed: Reason:", error)
    });
};

module.exports = connectDB;