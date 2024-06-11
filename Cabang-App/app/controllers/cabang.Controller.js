const Cabang = require("../models/cabang.model");
const { v4 } = require("uuid");
const amqp = require("amqplib");

let rabbitMQConnection;

// Queue untuk Event Base
const QueueCabangBaru = "QueueCabangBaru";
const QueueAllCabang = "QueueAllCabang";
const QueueCabangSatuan = "QueueCabangSatuan";
const QueueCabangByKota = "QueueCabangByKota";
const QueueUpCabang = "QueueUpCabang";
const QueueDelCabang = "QueueDelCabang";

// Function untuk menghubungkan ke RabbitMQ
async function connectRabbitMQ() {
  if (!rabbitMQConnection) {
    rabbitMQConnection = await amqp.connect("amqp://rabbitmq");
  }
}
exports.connectRabbitMQ = connectRabbitMQ;

// Membuat cabang baru
exports.createCabang = async (req, res) => {
  try {
    const newCabang = new Cabang({
      nama_cabang: req.body.nama_cabang,
      alamat_cabang: req.body.alamat_cabang,
      kota_cabang: req.body.kota_cabang,
      telp_cabang: req.body.telp_cabang,
      gambar_cabang: req.body.gambar_cabang,
    });
    const savedCabang = await newCabang.save();

    // Publish pesan ke RabbitMQ
    await connectRabbitMQ();
    const channel = await rabbitMQConnection.createChannel();
    await channel.assertQueue(QueueCabangBaru, { durable: false });

    // Pesan untuk publish
    const message = {
      notification: `Membuat cabang baru, yaitu: ${req.body.nama_cabang}`,
      Service: "Cabang",
    };

    // Kirim pesan ke queue
    channel.sendToQueue(QueueCabangBaru, Buffer.from(JSON.stringify(message)));
    console.log(`Publishing an Event using RabbitMQ: ${message.notification}`);
    await channel.close();

    res.status(201).send(savedCabang);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Read Cabang keseluruhan
exports.getAllCabang = async (req, res) => {
  try {
    const cabangs = await Cabang.find();

    // Publish pesan ke RabbitMQ
    await connectRabbitMQ();

    const channel = await rabbitMQConnection.createChannel();
    await channel.assertQueue(QueueAllCabang, { durable: false });

    // Pesan untuk publish
    const message = {
      notification: "Melihat seluruh cabang",
      Service: "Cabang",
    };

    // Kirim pesan ke queue
    channel.sendToQueue(QueueAllCabang, Buffer.from(JSON.stringify(message)));
    console.log(`Publishing an Event using RabbitMQ: ${message.notification}`);

    await channel.close();

    res.status(200).send(cabangs);
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(400).send({ error: "Failed to retrieve cabangs or publish message to RabbitMQ", details: error.message });
  }
};

// Read Cabang satuan
exports.getCabangById = async (req, res) => {
  try {
    const cabang = await Cabang.findOne({ id_cabang: req.params.id });
    if (!cabang) {
      return res.status(404).send({ message: "Cabang not found" });
    }

    // Publish pesan ke RabbitMQ
    await connectRabbitMQ();
    const channel = await rabbitMQConnection.createChannel();
    await channel.assertQueue(QueueCabangSatuan, { durable: false });

    // Pesan untuk publish
    const message = {
      notification: `Melihat Cabang Satuan dengan id ${req.params.id}`,
      Service: "Cabang",
    };

    // Kirim pesan ke queue
    channel.sendToQueue(QueueCabangSatuan, Buffer.from(JSON.stringify(message)));
    console.log(`Publishing an Event using RabbitMQ: ${message.notification}`);
    await channel.close();

    res.status(200).send(cabang);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Read Cabang By Kota
exports.getCabangByKota = async (req, res) => {
  try {
    const cabang = await Cabang.find({ kota_cabang: req.params.kota });
    if (!cabang) {
      return res.status(404).send({ message: "Cabang not found" });
    }

    // Publish pesan ke RabbitMQ
    await connectRabbitMQ();
    const channel = await rabbitMQConnection.createChannel();
    await channel.assertQueue(QueueCabangByKota, { durable: false });

    // Pesan untuk publish
    const message = {
      notification: `Melihat Cabang berdasarkan Kota ${req.params.kota}`,
      Service: "Cabang",
    };

    // Kirim pesan ke queue
    channel.sendToQueue(QueueCabangByKota, Buffer.from(JSON.stringify(message)));
    console.log(`Publishing an Event using RabbitMQ: ${message.notification}`);
    await channel.close();

    res.status(200).send(cabang);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Update Cabang
exports.updateCabang = async (req, res) => {
  try {
    const updatedCabang = await Cabang.findOneAndUpdate({ id_cabang: req.params.id }, req.body, { new: true });
    if (!updatedCabang) {
      return res.status(404).send({ message: "Cabang not found" });
    }

    // Publish pesan ke RabbitMQ
    await connectRabbitMQ();
    const channel = await rabbitMQConnection.createChannel();
    await channel.assertQueue(QueueUpCabang, { durable: false });

    // Pesan untuk publish
    const message = {
      notification: `Melakukan perubahan pada cabang dengan id ${req.params.id}`,
      Service: "Cabang",
    };

    // Kirim pesan ke queue
    channel.sendToQueue(QueueUpCabang, Buffer.from(JSON.stringify(message)));
    console.log(`Publishing an Event using RabbitMQ: ${message.notification}`);
    await channel.close();

    res.status(200).send(updatedCabang);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete Review
exports.deleteCabang = async (req, res) => {
  try {
    const deletedCabang = await Cabang.findOneAndDelete({ id_cabang: req.params.id });
    if (!deletedCabang) {
      return res.status(404).send({ message: "Cabang not found" });
    }

    // Publish pesan ke RabbitMQ
    await connectRabbitMQ();
    const channel = await rabbitMQConnection.createChannel();
    await channel.assertQueue(QueueDelCabang, { durable: false });

    // Pesan untuk publish
    const message = {
      notification: `Melakukan penghapusan pada cabang dengan id ${req.params.id}`,
      Service: "Cabang",
    };

    // Kirim pesan ke queue
    channel.sendToQueue(QueueDelCabang, Buffer.from(JSON.stringify(message)));
    console.log(`Publishing an Event using RabbitMQ: ${message.notification}`);
    await channel.close();

    res.status(200).send({ message: "Cabang deleted successfully" });
  } catch (error) {
    res.status(400).send(error);
  }
};
