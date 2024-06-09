const Menu = require("../models/menu.model");
const { v4 } = require("uuid");
const amqp = require("amqplib");

let rabbitMQConnection;

// Queue untuk Event Base
const QueueMenuBaru = "QueueMenuBaru";
const QueueAllMenu = "QueueAllMenu";
const QueueMenuSatuan = "QueueMenuSatuan";
const QueueMenuByKA = "QueueMenuByKA";
const QueueMenuByPO = "QueueMenuByPO";
const QueueUpMenu = "QueueUpMenu";
const QueueDelMenu = "QueueDelMenu";

// Function untuk menghubungkan ke RabbitMQ
async function connectRabbitMQ() {
  if (!rabbitMQConnection) {
    rabbitMQConnection = await amqp.connect("amqp://rabbitmq");
  }
}
exports.connectRabbitMQ = connectRabbitMQ;

// Membuat Menu baru
exports.createMenu = async (req, res) => {
  try {
    const newMenu = new Menu({
      nama_menu: req.body.nama_menu,
      posisi_karyawan: req.body.posisi_karyawan,
      deskripsi_menu: req.body.deskripsi_menu,
      kategori_menu: req.body.kategori_menu,
      gambar_menu: req.body.gambar_menu,
    });
    const savedMenu = await newMenu.save();

    // Publish pesan ke RabbitMQ
    await connectRabbitMQ();
    const channel = await rabbitMQConnection.createChannel();
    await channel.assertQueue(QueueMenuBaru, { durable: false });

    // Pesan untuk publish
    const message = {
      notification: `Membuat menu baru, yaitu: ${req.body.nama_menu}`,
      Service: "Menu",
    };

    // Kirim pesan ke queue
    channel.sendToQueue(QueueMenuBaru, Buffer.from(JSON.stringify(message)));
    console.log(`Publishing an Event using RabbitMQ: ${message.notification}`);
    await channel.close();

    res.status(201).send(savedMenu);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Read Menu keseluruhan
exports.getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.find();

    // Publish pesan ke RabbitMQ
    await connectRabbitMQ();

    const channel = await rabbitMQConnection.createChannel();
    await channel.assertQueue(QueueAllMenu, { durable: false });

    // Pesan untuk publish
    const message = {
      notification: "Melihat seluruh menu",
      Service: "Menu",
    };

    // Kirim pesan ke queue
    channel.sendToQueue(QueueAllMenu, Buffer.from(JSON.stringify(message)));
    console.log(`Publishing an Event using RabbitMQ: ${message.notification}`);

    await channel.close();

    res.status(200).send(menus);
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(400).send({ error: "Failed to retrieve menus or publish message to RabbitMQ", details: error.message });
  }
};

// Read Menu satuan
exports.getMenuById = async (req, res) => {
  try {
    const menu = await Menu.findOne({ id_menu: req.params.id });
    if (!menu) {
      return res.status(404).send({ message: "Menu not found" });
    }

    // Publish pesan ke RabbitMQ
    await connectRabbitMQ();
    const channel = await rabbitMQConnection.createChannel();
    await channel.assertQueue(QueueMenuSatuan, { durable: false });

    // Pesan untuk publish
    const message = {
      notification: `Melihat Menu Satuan dengan id ${req.params.id}`,
      Service: "Menu",
    };

    // Kirim pesan ke queue
    channel.sendToQueue(QueueMenuSatuan, Buffer.from(JSON.stringify(message)));
    console.log(`Publishing an Event using RabbitMQ: ${message.notification}`);
    await channel.close();

    res.status(200).send(menu);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Read Menu By Kategori
exports.getMenuByKategori = async (req, res) => {
  try {
    const menu = await Menu.find({ kategori_menu: req.params.kategori });
    if (!menu) {
      return res.status(404).send({ message: "Menu not found" });
    }

    // Publish pesan ke RabbitMQ
    await connectRabbitMQ();
    const channel = await rabbitMQConnection.createChannel();
    await channel.assertQueue(QueueMenuByKA, { durable: false });

    // Pesan untuk publish
    const message = {
      notification: `Melihat Menu berdasarkan kategori: ${req.params.kategori}`,
      Service: "Menu",
    };

    // Kirim pesan ke queue
    channel.sendToQueue(QueueMenuByKA, Buffer.from(JSON.stringify(message)));
    console.log(`Publishing an Event using RabbitMQ: ${message.notification}`);
    await channel.close();

    res.status(200).send(menu);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Read Menu By Posisi
exports.getMenuByPosisi = async (req, res) => {
  try {
    const menu = await Menu.find({ posisi_karyawan: req.params.posisi });
    if (!menu) {
      return res.status(404).send({ message: "Menu not found" });
    }

    // Publish pesan ke RabbitMQ
    await connectRabbitMQ();
    const channel = await rabbitMQConnection.createChannel();
    await channel.assertQueue(QueueMenuByPO, { durable: false });

    // Pesan untuk publish
    const message = {
      notification: `Melihat Menu berdasarkan posisi karyawan: ${req.params.posisi}`,
      Service: "Menu",
    };

    // Kirim pesan ke queue
    channel.sendToQueue(QueueMenuByPO, Buffer.from(JSON.stringify(message)));
    console.log(`Publishing an Event using RabbitMQ: ${message.notification}`);
    await channel.close();

    res.status(200).send(menu);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Update menu
exports.updateMenu = async (req, res) => {
  try {
    const updatedMenu = await Menu.findOneAndUpdate({ id_menu: req.params.id }, req.body, { new: true });
    if (!updatedMenu) {
      return res.status(404).send({ message: "Menu not found" });
    }

    // Publish pesan ke RabbitMQ
    await connectRabbitMQ();
    const channel = await rabbitMQConnection.createChannel();
    await channel.assertQueue(QueueUpMenu, { durable: false });

    // Pesan untuk publish
    const message = {
      notification: `Melakukan perubahan pada menu dengan id ${req.params.id}`,
      Service: "Menu",
    };

    // Kirim pesan ke queue
    channel.sendToQueue(QueueUpMenu, Buffer.from(JSON.stringify(message)));
    console.log(`Publishing an Event using RabbitMQ: ${message.notification}`);
    await channel.close();

    res.status(200).send(updatedMenu);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete Review
exports.deleteMenu = async (req, res) => {
  try {
    const deletedMenu = await Menu.findOneAndDelete({ id_menu: req.params.id });
    if (!deletedMenu) {
      return res.status(404).send({ message: "Menu not found" });
    }

    // Publish pesan ke RabbitMQ
    await connectRabbitMQ();
    const channel = await rabbitMQConnection.createChannel();
    await channel.assertQueue(QueueDelMenu, { durable: false });

    // Pesan untuk publish
    const message = {
      notification: `Melakukan penghapusan pada menu dengan id ${req.params.id}`,
      Service: "Menu",
    };

    // Kirim pesan ke queue
    channel.sendToQueue(QueueDelMenu, Buffer.from(JSON.stringify(message)));
    console.log(`Publishing an Event using RabbitMQ: ${message.notification}`);
    await channel.close();

    res.status(200).send({ message: "Menu deleted successfully" });
  } catch (error) {
    res.status(400).send(error);
  }
};