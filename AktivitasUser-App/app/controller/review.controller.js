const Aktivitas = require("../models/aktivitas.model");

const QueueReviewBaru = "QueueReviewBaru";
const QueueAllReview = "QueueAllReview";
const QueueReviewSatuan = "QueueReviewSatuan";
const QueueUpReview = "QueueUpReview";
const QueueDelReview = "QueueDelReview";

const handleQueueMessage = async (channel, queue) => {
  await channel.assertQueue(queue, { durable: false });
  channel.consume(queue, async (message) => {
    if (message !== null) {
      const receivedJSON = JSON.parse(message.content.toString());
      console.log(`Capturing an Event using RabbitMQ to:`, receivedJSON);
      try {
        const newAktivitas = new Aktivitas({
          aktivitas_user: receivedJSON.notification,
          Service: receivedJSON.Service,
        });
        await newAktivitas.save();
        console.log("Aktivitas baru berhasil disimpan ke database.");
      } catch (error) {
        console.error(`Error handling message for queue ${queue}:`, error);
      }
      channel.ack(message);
    }
  });
};

const listenNewReview = async (channel) => {
  await handleQueueMessage(channel, QueueReviewBaru);
};

const listenAllReview = async (channel) => {
  await handleQueueMessage(channel, QueueAllReview);
};

const listenReviewSatuan = async (channel) => {
  await handleQueueMessage(channel, QueueReviewSatuan);
};

const listenUpReview = async (channel) => {
  await handleQueueMessage(channel, QueueUpReview);
};

const listenDelReview = async (channel) => {
  await handleQueueMessage(channel, QueueDelReview);
};

module.exports = {
  listenNewReview,
  listenAllReview,
  listenReviewSatuan,
  listenUpReview,
  listenDelReview,
};
