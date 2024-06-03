const Karyawan = require('../models/karyawan.model');

// Membuat karyawan baru
exports.createKaryawan = async(req, res) => {
    try {
        const newKaryawan = new Karyawan({
            nama_karyawan: req.body.nama_karyawan,
            id_cabang: req.body.id_cabang,
            posisi_karyawan: req.body.posisi_karyawan,
            telp_karyawan: req.body.telp_karyawan,
            gambar_karyawan: req.body.gambar_karyawan,
        });
        const savedKaryawan = await newKaryawan.save();
        res.status(201).send(savedKaryawan);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Read Karyawan keseluruhan
exports.getAllKaryawans = async(req, res) => {
    try {
        const karyawans = await Karyawan.find();
        res.status(200).send(karyawans);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Read Karyawan satuan
exports.getKaryawanById = async(req, res) => {
    try {
        const karyawan = await Karyawan.findOne({ id_karyawan: req.params.id });
        if (!karyawan) {
            return res.status(404).send({ message: 'Karyawan not found' });
        }
        res.status(200).send(karyawan);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Update Karyawan
exports.updateKaryawan = async(req, res) => {
    try {
        const updatedKaryawan = await Karyawan.findOneAndUpdate(
            { id_karyawan: req.params.id },
            req.body,
            { new: true }
        );
        if (!updatedKaryawan) {
            return res.status(404).send({ message: 'Karyawan not found' });
        }
        res.status(200).send(updatedKaryawan);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete Karyawan
exports.deleteKaryawan = async(req, res) => {
    try {
        const deletedKaryawan = await Karyawan.findOneAndDelete({ id_karyawan: req.params.id });
        if (!deletedKaryawan) {
            return res.status(404).send({ message: 'Karyawan not found' });
        }
        res.status(200).send({ message: 'Karyawan deleted successfully' });
    } catch (error) {
        res.status(400).send(error);
    }
};