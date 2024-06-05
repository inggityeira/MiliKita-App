const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  id_user: {
    type: String,
    required: true,
    index: true,
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
