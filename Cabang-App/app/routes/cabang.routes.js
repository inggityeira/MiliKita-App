const express = require('express');
const router = express.Router();
const cabangController = require('../controllers/cabang.Controller');

router.post('/cabangs', cabangController.createCabang);
router.get('/cabang', cabangController.getAllCabang);
router.get('/cabangs/:id', cabangController.getCabangById);
router.put('/cabangs/:id', cabangController.updateCabang);
router.delete('/cabangs/:id', cabangController.deleteCabang);

module.exports = router;