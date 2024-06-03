const mongoose = require("mongoose");

const connectDB = async () => {
mongoose
    .connect("mongodb+srv://nadyasri:geQjJLDwfaFGY1Hn@cabangmilikitadb.cpnhufx.mongodb.net/MiliKita?retryWrites=true&w=majority&appName=CabangMilikitaDB")
    .then(() => {
        console.log("Connected to database!");
    })
    .catch((error) => {
        console.error("Connection failed! Reasom:", error);
    });
};

module.exports = connectDB;
