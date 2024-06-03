const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const MenuSchema = mongoose.Schema(
    {
        id_menu: {
            type: Number,
            unique: true,
            index: true,
        },
        nama_menu: {
            type: String,
            required: true,
        },
        posisi_karyawan: {
            type: String,
            enum: ['barista', 'chef', 'bakery', 'owner'],
            required: true,
        },
        deskripsi_menu: {
            type: String,
            required: true,
        },
        kategori_menu: {
            type: String,
            required: true,
        },
        gambar_menu: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

MenuSchema.plugin(AutoIncrement, { inc_field: 'id_menu' });

const Menu = mongoose.model("Menu", MenuSchema);
module.exports = Menu;