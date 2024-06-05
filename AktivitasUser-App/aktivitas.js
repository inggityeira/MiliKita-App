const express = require("express");
const app = express();
const amqp = require("amqplib");

// Environment
const connectDB = require("./app/config/database");
const Aktivitas = require("./app/models/aktivitas.model");
const PORT = process.env.PORT || 5004;

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
const messagesStorage = [];

// REVIEW!!
// Queue Review
const QueueReviewBaru = "QueueReviewBaru";
const QueueAllReview = "QueueAllReview";
const QueueReviewSatuan = "QueueReviewSatuan";
const QueueUpReview = "QueueUpReview";
const QueueDelReview = "QueueDelReview";

// Subscribe New Review
async function listenNewReview() {
  const channel = await rabbitMQConnection.createChannel();
  await channel.assertQueue(QueueReviewBaru, { durable: false });
  channel.consume(QueueReviewBaru, async (message) => {
    if (message !== null) {
      const receivedJSON = JSON.parse(message.content.toString());
      console.log(`Capturing an Event using RabbitMQ to:`, receivedJSON);
      messagesStorage.push(receivedJSON);
      try {
        const newAktivitas = new Aktivitas({
          aktivitas_user: receivedJSON.notification,
        });
        const savedAktivitas = await newAktivitas.save();
        console.log("Aktivitas baru berhasil disimpan ke database.");
      } catch (error) {
        console.error("Error saat menyimpan Aktivitas ke database:", error);
      }
      channel.ack(message);
    }
  });
}

// Subscribe All Review
async function listenAllReview() {
  const channel = await rabbitMQConnection.createChannel();
  await channel.assertQueue(QueueAllReview, { durable: false });
  channel.consume(QueueAllReview, async (message) => {
    if (message !== null) {
      const receivedJSON = JSON.parse(message.content.toString());
      console.log(`Capturing an Event using RabbitMQ to:`, receivedJSON);
      messagesStorage.push(receivedJSON);
      try {
        const newAktivitas = new Aktivitas({
          aktivitas_user: receivedJSON.notification,
        });
        const savedAktivitas = await newAktivitas.save();
        console.log("Aktivitas baru berhasil disimpan ke database.");
      } catch (error) {
        console.error("Error saat menyimpan Aktivitas ke database:", error);
      }
      channel.ack(message);
    }
  });
}

// Subscribe Review Satuan
async function listenReviewSatuan() {
  const channel = await rabbitMQConnection.createChannel();
  await channel.assertQueue(QueueReviewSatuan, { durable: false });
  channel.consume(QueueReviewSatuan, async (message) => {
    if (message !== null) {
      const receivedJSON = JSON.parse(message.content.toString());
      console.log(`Capturing an Event using RabbitMQ to:`, receivedJSON);
      messagesStorage.push(receivedJSON);
      try {
        const newAktivitas = new Aktivitas({
          aktivitas_user: receivedJSON.notification,
        });
        const savedAktivitas = await newAktivitas.save();
        console.log("Aktivitas baru berhasil disimpan ke database.");
      } catch (error) {
        console.error("Error saat menyimpan Aktivitas ke database:", error);
      }
      channel.ack(message);
    }
  });
}

// Subscribe Update Review
async function listenUpReview() {
  const channel = await rabbitMQConnection.createChannel();
  await channel.assertQueue(QueueUpReview, { durable: false });
  channel.consume(QueueUpReview, async (message) => {
    if (message !== null) {
      const receivedJSON = JSON.parse(message.content.toString());
      console.log(`Capturing an Event using RabbitMQ to:`, receivedJSON);
      messagesStorage.push(receivedJSON);
      try {
        const newAktivitas = new Aktivitas({
          aktivitas_user: receivedJSON.notification,
        });
        const savedAktivitas = await newAktivitas.save();
        console.log("Aktivitas baru berhasil disimpan ke database.");
      } catch (error) {
        console.error("Error saat menyimpan Aktivitas ke database:", error);
      }
      channel.ack(message);
    }
  });
}

// Subscribe Update Review
async function listenDelReview() {
  const channel = await rabbitMQConnection.createChannel();
  await channel.assertQueue(QueueDelReview, { durable: false });
  channel.consume(QueueDelReview, async (message) => {
    if (message !== null) {
      const receivedJSON = JSON.parse(message.content.toString());
      console.log(`Capturing an Event using RabbitMQ to:`, receivedJSON);
      messagesStorage.push(receivedJSON);
      try {
        const newAktivitas = new Aktivitas({
          aktivitas_user: receivedJSON.notification,
        });
        const savedAktivitas = await newAktivitas.save();
        console.log("Aktivitas baru berhasil disimpan ke database.");
      } catch (error) {
        console.error("Error saat menyimpan Aktivitas ke database:", error);
      }
      channel.ack(message);
    }
  });
}

amqp.connect("amqp://localhost").then(async (connection) => {
  rabbitMQConnection = connection;
  // Review
  listenNewReview();
  listenAllReview();
  listenReviewSatuan();
  listenUpReview();
  listenDelReview();

  app.listen(PORT, () => {
    console.log(` 😀 server on port ${PORT}  `);
  });
});
