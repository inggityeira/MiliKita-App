const express = require('express');
const router = express.Router();
const cabangController = require('E:\TUGAS SEMESTER 6\Tugas Besar IAE\Cabang-App\app\routes\cabang.routes.js');

router.post('/cabangs', cabangControllerController.createCabang);
router.get('/cabangs', cabangController.getAllCabang);
router.get('/cabangs/:id', cabangController.getCabangById);
router.put('/cabangs/:id', cabangController.updateCabang);
router.delete('/cabangs/:id', cabangController.deleteCabang);

module.exports = router;