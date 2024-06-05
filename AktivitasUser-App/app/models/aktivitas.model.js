const mongoose = require('mongoose');

const AktivitasSchema = mongoose.Schema(
    {
        aktivitas_user: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Aktivitas = mongoose.model("Aktivitas", AktivitasSchema);
module.exports = Aktivitas;