const Aktivitas = require("../models/aktivitas.model");

const QueueCabangBaru = "QueueCabangBaru";
const QueueAllCabang = "QueueAllCabang";
const QueueCabangSatuan = "QueueCabangSatuan";
const QueueUpCabang = "QueueUpCabang";
const QueueDelCabang = "QueueDelCabang";

const handleQueueMessage = async (channel, queue) => {
    await channel.assertQueue(queue, { durable: false });
    channel.consume(queue, async (message) => {
      if (message !== null) {
        const receivedJSON = JSON.parse(message.content.toString());
        console.log(`Capturing an Event using RabbitMQ to:`, receivedJSON);
        try {
          const newAktivitas = new Aktivitas({ aktivitas_user: receivedJSON.notification });
          await newAktivitas.save();
          console.log("Aktivitas baru berhasil disimpan ke database.");
        } catch (error) {
          console.error(`Error handling message for queue ${queue}:`, error);
        }
        channel.ack(message);
      }
    });
  };
  
  const listenNewCabang = async (channel) => {
    await handleQueueMessage(channel, QueueCabangBaru);
  };
  
  const listenAllCabang = async (channel) => {
    await handleQueueMessage(channel, QueueAllCabang);
  };
  
  const listenCabangSatuan = async (channel) => {
    await handleQueueMessage(channel, QueueCabangSatuan);
  };
  
  const listenUpCabang = async (channel) => {
    await handleQueueMessage(channel, QueueUpCabang);
  };
  
  const listenDelCabang = async (channel) => {
    await handleQueueMessage(channel, QueueDelCabang);
  };
  
  module.exports = {
    listenNewCabang,
    listenAllCabang,
    listenCabangSatuan,
    listenUpCabang,
    listenDelCabang,
  };