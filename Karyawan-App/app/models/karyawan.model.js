const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const KaryawanSchema = mongoose.Schema(
    {
        id_karyawan: {
            type: Number,
            unique: true,
            index: true,
        },
        nama_karyawan: {
            type: String,
            required: true,
        },
        id_cabang: {
            type: Number,
            required: true,
        },
        posisi_karyawan: {
            type: String,
            enum: ['barista','chef','bakery', 'owner'],
            required: true,
        },
        telp_karyawan: {
            type: Number,
            required: true,
        },
        gambar_karyawan: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

KaryawanSchema.plugin(AutoIncrement, { inc_field: 'id_karyawan' });

const Karyawan = mongoose.model("Karyawan", KaryawanSchemaSchema);
module.exports = Karyawan;