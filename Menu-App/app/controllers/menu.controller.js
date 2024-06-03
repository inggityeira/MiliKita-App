const Menu = require('../models/menu.model');

// Membuat review baru
exports.createMenu = async(req, res) => {
    try {
        const newMenu = new Menu({
            nama_menu: req.body.nama_menu,
            posisi_karyawan: req.body.posisi_karyawan,
            deskripsi_menu: req.body.deskripsi_menu,
            kategori_menu: req.body.kategori_menu,
            gambar_menu: req.body.gambar_menu,
        });
        const savedMenu = await newMenu.save();
        res.status(201).send(savedMenu);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Read Review keseluruhan
exports.getAllMenus = async(req, res) => {
    try {
        const menus = await Menu.find();
        res.status(200).send(menus);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Read Review satuan
exports.getMenuById = async(req, res) => {
    try {
        const menu = await Menu.findOne({ id_menu: req.params.id });
        if (!menu) {
            return res.status(404).send({ message: 'Menu not found' });
        }
        res.status(200).send(menu);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Update menu
exports.updateMenu = async(req, res) => {
    try {
        const updatedMenu = await Menu.findOneAndUpdate(
            { id_menu: req.params.id },
            req.body,
            { new: true }
        );
        if (!updatedMenu) {
            return res.status(404).send({ message: 'Menu not found' });
        }
        res.status(200).send(updatedMenu);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete Review
exports.deleteMenu = async(req, res) => {
    try {
        const deletedMenu = await Menu.findOneAndDelete({ id_menu: req.params.id });
        if (!deletedMenu) {
            return res.status(404).send({ message: 'Menu not found' });
        }
        res.status(200).send({ message: 'Menu deleted successfully' });
    } catch (error) {
        res.status(400).send(error);
    }
};