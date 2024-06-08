const Karyawan = require("../models/karyawan.model");
const { v4 } = require("uuid");
const amqp = require("amqplib");

let rabbitMQConnection;

// Queue untuk Event Base
const QueueKaryawanBaru = "QueueKaryawanBaru";
const QueueAllKaryawan = "QueueAllKaryawan";
const QueueKaryawanSatuan = "QueueKaryawanSatuan";
const QueueKaryawanByPO = "QueueKaryawanByPO";
const QueueKaryawanByCA = "QueueKaryawanByCA";
const QueueUpKaryawan = "QueueUpKaryawan";
const QueueDelKaryawan = "QueueDelKaryawan";

// Function untuk menghubungkan ke RabbitMQ
async function connectRabbitMQ() {
  if (!rabbitMQConnection) {
    rabbitMQConnection = await amqp.connect("amqp://rabbitmq");
  }
}
exports.connectRabbitMQ = connectRabbitMQ;

// Membuat karyawan baru
exports.createKaryawan = async (req, res) => {
  try {
    const newKaryawan = new Karyawan({
      nama_karyawan: req.body.nama_karyawan,
      id_cabang: req.body.id_cabang,
      posisi_karyawan: req.body.posisi_karyawan,
      telp_karyawan: req.body.telp_karyawan,
      gambar_karyawan: req.body.gambar_karyawan,
    });
    const savedKaryawan = await newKaryawan.save();

    // Publish pesan ke RabbitMQ
    await connectRabbitMQ();
    const channel = await rabbitMQConnection.createChannel();
    await channel.assertQueue(QueueKaryawanBaru, { durable: false });

    // Pesan untuk publish
    const message = {
      notification: `Membuat karyawan baru, yaitu: ${req.body.nama_karyawan}`,
      Service: "Karyawan",
    };

    // Kirim pesan ke queue
    channel.sendToQueue(QueueKaryawanBaru, Buffer.from(JSON.stringify(message)));
    console.log(`Publishing an Event using RabbitMQ: ${message.notification}`);
    await channel.close();

    res.status(201).send(savedKaryawan);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Read Karyawan keseluruhan
exports.getAllKaryawans = async (req, res) => {
  try {
    const karyawans = await Karyawan.find();

    // Publish pesan ke RabbitMQ
    await connectRabbitMQ();

    const channel = await rabbitMQConnection.createChannel();
    await channel.assertQueue(QueueAllKaryawan, { durable: false });

    // Pesan untuk publish
    const message = {
      notification: "Melihat seluruh review",
      Service: "Karyawan",
    };

    // Kirim pesan ke queue
    channel.sendToQueue(QueueAllKaryawan, Buffer.from(JSON.stringify(message)));
    console.log(`Publishing an Event using RabbitMQ: ${message.notification}`);

    await channel.close();

    res.status(200).send(karyawans);
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(400).send({ error: "Failed to retrieve karyawan or publish message to RabbitMQ", details: error.message });
  }
};

// Read Karyawan satuan
exports.getKaryawanById = async (req, res) => {
  try {
    const karyawan = await Karyawan.findOne({ id_karyawan: req.params.id });
    if (!karyawan) {
      return res.status(404).send({ message: "Karyawan not found" });
    }

    // Publish pesan ke RabbitMQ
    await connectRabbitMQ();
    const channel = await rabbitMQConnection.createChannel();
    await channel.assertQueue(QueueKaryawanSatuan, { durable: false });

    // Pesan untuk publish
    const message = {
      notification: `Melihat Karyawan Satuan dengan id ${req.params.id}`,
      Service: "Karyawan",
    };

    // Kirim pesan ke queue
    channel.sendToQueue(QueueKaryawanSatuan, Buffer.from(JSON.stringify(message)));
    console.log(`Publishing an Event using RabbitMQ: ${message.notification}`);
    await channel.close();

    res.status(200).send(karyawan);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Read Karyawan By Posisi
exports.getKaryawanByPosisi = async (req, res) => {
  try {
    const karyawan = await Karyawan.findOne({ posisi_karyawan: req.params.posisi });
    if (!karyawan) {
      return res.status(404).send({ message: "Karyawan not found" });
    }

    // Publish pesan ke RabbitMQ
    await connectRabbitMQ();
    const channel = await rabbitMQConnection.createChannel();
    await channel.assertQueue(QueueKaryawanByPO, { durable: false });

    // Pesan untuk publish
    const message = {
      notification: `Melihat Karyawan berdasarkan posisi ${req.params.posisi}`,
      Service: "Karyawan",
    };

    // Kirim pesan ke queue
    channel.sendToQueue(QueueKaryawanByPO, Buffer.from(JSON.stringify(message)));
    console.log(`Publishing an Event using RabbitMQ: ${message.notification}`);
    await channel.close();

    res.status(200).send(karyawan);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Read Karyawan By Cabang
exports.getKaryawanByCabang = async (req, res) => {
  try {
    const karyawan = await Karyawan.findOne({ id_cabang: req.params.id_cabang });
    if (!karyawan) {
      return res.status(404).send({ message: "Karyawan not found" });
    }

    // Publish pesan ke RabbitMQ
    await connectRabbitMQ();
    const channel = await rabbitMQConnection.createChannel();
    await channel.assertQueue(QueueKaryawanByCA, { durable: false });

    // Pesan untuk publish
    const message = {
      notification: `Melihat Karyawan berdasarkan posisi ${req.params.posisi}`,
      Service: "Karyawan",
    };

    // Kirim pesan ke queue
    channel.sendToQueue(QueueKaryawanByCA, Buffer.from(JSON.stringify(message)));
    console.log(`Publishing an Event using RabbitMQ: ${message.notification}`);
    await channel.close();

    res.status(200).send(karyawan);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Update Karyawan
exports.updateKaryawan = async (req, res) => {
  try {
    const updatedKaryawan = await Karyawan.findOneAndUpdate({ id_karyawan: req.params.id }, req.body, { new: true });
    if (!updatedKaryawan) {
      return res.status(404).send({ message: "Karyawan not found" });
    }

    // Publish pesan ke RabbitMQ
    await connectRabbitMQ();
    const channel = await rabbitMQConnection.createChannel();
    await channel.assertQueue(QueueUpKaryawan, { durable: false });

    // Pesan untuk publish
    const message = {
      notification: `Melakukan perubahan pada Karyawan dengan id ${req.params.id}`,
      Service: "Karyawan",
    };

    // Kirim pesan ke queue
    channel.sendToQueue(QueueUpKaryawan, Buffer.from(JSON.stringify(message)));
    console.log(`Publishing an Event using RabbitMQ: ${message.notification}`);
    await channel.close();

    res.status(200).send(updatedKaryawan);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete Karyawan
exports.deleteKaryawan = async (req, res) => {
  try {
    const deletedKaryawan = await Karyawan.findOneAndDelete({ id_karyawan: req.params.id });
    if (!deletedKaryawan) {
      return res.status(404).send({ message: "Karyawan not found" });
    }

    // Publish pesan ke RabbitMQ
    await connectRabbitMQ();
    const channel = await rabbitMQConnection.createChannel();
    await channel.assertQueue(QueueDelKaryawan, { durable: false });

    // Pesan untuk publish
    const message = {
      notification: `Melakukan penghapusan pada karyawan dengan id ${req.params.id}`,
      Service: "Karyawan",
    };

    // Kirim pesan ke queue
    channel.sendToQueue(QueueDelKaryawan, Buffer.from(JSON.stringify(message)));
    console.log(`Publishing an Event using RabbitMQ: ${message.notification}`);
    await channel.close();

    res.status(200).send({ message: "Karyawan deleted successfully" });
  } catch (error) {
    res.status(400).send(error);
  }
};
