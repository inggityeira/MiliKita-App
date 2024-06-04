const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  id_karyawan: {
    type: String,
    required: true,
  },
  nama_karyawan: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('User', UserSchema);
