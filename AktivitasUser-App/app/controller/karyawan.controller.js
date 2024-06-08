const Aktivitas = require("../models/aktivitas.model");

const QueueKaryawanBaru = "QueueKaryawanBaru";
const QueueAllKaryawan = "QueueAllKaryawan";
const QueueKaryawanSatuan = "QueueKaryawanSatuan";
const QueueUpKaryawan = "QueueUpKaryawan";
const QueueDelKaryawan = "QueueDelKaryawan";

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

const listenNewKaryawan = async (channel) => {
  await handleQueueMessage(channel, QueueKaryawanBaru);
};

const listenAllKaryawan = async (channel) => {
  await handleQueueMessage(channel, QueueAllKaryawan);
};

const listenKaryawanSatuan = async (channel) => {
  await handleQueueMessage(channel, QueueKaryawanSatuan);
};

const listenUpKaryawan = async (channel) => {
  await handleQueueMessage(channel, QueueUpKaryawan);
};

const listenDelKaryawan = async (channel) => {
  await handleQueueMessage(channel, QueueDelKaryawan);
};

module.exports = {
  listenNewKaryawan,
  listenAllKaryawan,
  listenKaryawanSatuan,
  listenUpKaryawan,
  listenDelKaryawan,
};
