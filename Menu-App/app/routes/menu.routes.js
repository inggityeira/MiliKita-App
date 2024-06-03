const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menu.controller');

router.post('/menu', menuControllerController.createMenu);
router.get('/menus', menuController.getAllMenus);
router.get('/menu/:id', menuControllerController.getMenuById);
router.put('/menu/:id', menuControllerController.updateMenu);
router.delete('/menu/:id', menuControllerController.deleteMenu);

module.exports = router;