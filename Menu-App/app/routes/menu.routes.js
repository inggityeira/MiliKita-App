const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menu.controller');

router.post('/menuMiliKita', menuController.createMenu);
router.get('/menusMiliKita', menuController.getAllMenus);
router.get('/menuMiliKita/:id', menuController.getMenuById);
router.get('/menuMiliKita/kategori/:kategori', menuController.getMenuByKategori);
router.get('/menuMiliKita/posisi/:posisi', menuController.getMenuByPosisi);
router.put('/menuMiliKita/:id', menuController.updateMenu);
router.delete('/menuMiliKita/:id', menuController.deleteMenu);

module.exports = router;