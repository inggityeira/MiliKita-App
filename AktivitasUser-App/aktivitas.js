const express = require("express");
const app = express();
const amqp = require("amqplib");

// Environment
const PORT = process.env.PORT || 5004;
const connectDB = require("./app/config/database");
const Aktivitas = require("./app/models/aktivitas.model");
const reviewController = require('./app/controller/review.controller');
const cabangController = require('./app/controller/cabang.controller');
const karyawanController = require('./app/controller/karyawan.controller');
const menuController = require('./app/controller/menu.controller')

// register middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// connect database dan port
connectDB();

// Melihat seluruh aktivitas
app.get("/AllAktivitas", async (req, res) => {
  try {
    const Aktivitass = await Aktivitas.find();
    res.status(200).send(Aktivitass);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Kebutuhan Event Base
let rabbitMQConnection;

amqp.connect("amqp://rabbitmq").then(async (connection) => {
  rabbitMQConnection = connection;
  const channel = await rabbitMQConnection.createChannel();

  // Review
  reviewController.listenNewReview(channel);
  reviewController.listenAllReview(channel);
  reviewController.listenReviewSatuan(channel);
  reviewController.listenUpReview(channel);
  reviewController.listenDelReview(channel);

  // Cabang
  cabangController.listenNewCabang(channel);
  cabangController.listenAllCabang(channel);
  cabangController.listenCabangSatuan(channel);
  cabangController.listenCabangByKota(channel);
  cabangController.listenUpCabang(channel);
  cabangController.listenDelCabang(channel);

  // Karyawan
  karyawanController.listenNewKaryawan(channel);
  karyawanController.listenAllKaryawan(channel);
  karyawanController.listenKaryawanSatuan(channel);
  karyawanController.listenKaryawanPosisi(channel);
  karyawanController.listenKaryawanCabang(channel);
  karyawanController.listenUpKaryawan(channel);
  karyawanController.listenDelKaryawan(channel);

  // Menu
  menuController.listenNewMenu(channel);
  menuController.listenAllMenu(channel);
  menuController.listenMenuSatuan(channel);
  menuController.listenMenuByKA(channel);
  menuController.listenMenuByPO(channel);
  menuController.listenUpMenu(channel);
  menuController.listenDelMenu(channel);

  app.listen(PORT, () => {
    console.log(` 😀 server on port ${PORT}  `);
  });
});
