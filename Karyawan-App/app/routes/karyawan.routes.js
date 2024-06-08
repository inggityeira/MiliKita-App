const express = require('express');
const router = express.Router();
const karyawanController = require('../controllers/karyawan.controller');

router.post('/karyawankita', karyawanController.createKaryawan);
router.get('/karyawanskita', karyawanController.getAllKaryawans);
router.get('/karyawankita/:id', karyawanController.getKaryawanById);
router.get('/karyawankita/Posisi/:posisi', karyawanController.getKaryawanByPosisi);
router.get('/karyawankita/Cabang/:id_cabang', karyawanController.getKaryawanByCabang);
router.put('/karyawankita/:id', karyawanController.updateKaryawan);
router.delete('/karyawankita/:id', karyawanController.deleteKaryawan);

module.exports = router;