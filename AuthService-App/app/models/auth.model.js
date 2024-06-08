const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const UserSchema = new mongoose.Schema(
  {
    id_user: {
      type: Number,
      unique: true,
      index: true,
    },
    nama_lengkap: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.plugin(AutoIncrement, {inc_field: 'id_user'});

const Pengguna = mongoose.model("User", UserSchema);
module.exports = Pengguna;