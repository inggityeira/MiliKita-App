const Cabang = require('E:\TUGAS SEMESTER 6\Tugas Besar IAE\Cabang-App\app\models\cabang.model.js');

// Membuat review baru
exports.createCabang = async(req, res) => {
    try {
        const newCabang = new Cabang({
            nama_cabang: req.body.nama_cabang,
            alamat_cabang: req.body.alamat_cabang,
            kota_cabang: req.body.kota_cabang,
            telp_cabang: req.body.telp_cabang,
            gambar_cabang: req.body.gambar_cabang,
        });
        const savedCabang = await newCabang.save();
        res.status(201).send(savedCabang);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Read Review keseluruhan
exports.getAllCabang = async(req, res) => {
    try {
        const cabangs = await Cabang.find();
        res.status(200).send(cabangs);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Read Review satuan
exports.getCabangById = async(req, res) => {
    try {
        const cabang = await Cabang.findOne({ id_cabang: req.params.id });
        if (!cabang) {
            return res.status(404).send({ message: 'Cabang not found' });
        }
        res.status(200).send(cabang);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Update review
exports.updateCabang = async(req, res) => {
    try {
        const updatedCabang = await Cabang.findOneAndUpdate(
            { id_cabang: req.params.id },
            req.body,
            { new: true }
        );
        if (!updatedCabang) {
            return res.status(404).send({ message: 'Cabang not found' });
        }
        res.status(200).send(updatedCabang);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete Review
exports.deleteCabang = async(req, res) => {
    try {
        const deletedCabang = await Cabang.findOneAndDelete({ id_cabang: req.params.id });
        if (!deletedCabang) {
            return res.status(404).send({ message: 'Cabang not found' });
        }
        res.status(200).send({ message: 'Cabang deleted successfully' });
    } catch (error) {
        res.status(400).send(error);
    }
};