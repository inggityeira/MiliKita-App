const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const CabangSchema = mongoose.Schema(
    {
        id_cabang: {
            type: Number,
            unique: true,
            index: true,
        },
        nama_cabang: {
            type: String,
            required: true,
        },
        alamat_cabang: {
            type: String,
            required: true,
        },
        kota_cabang: {
            type: String,
            required: true,
        },
        telp_cabang:{
            type: Number,
            required: true,
        },
        gambar_cabang: {
            type: string,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

CabangSchema.plugin(AutoIncrement, { inc_field: 'id_cabang' });

const Cabang = mongoose.model("Cabang", CabangSchema);
module.exports = Cabang;