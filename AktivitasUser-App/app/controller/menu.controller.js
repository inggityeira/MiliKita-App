const Aktivitas = require("../models/aktivitas.model");

const QueueMenuBaru = "QueueMenuBaru";
const QueueAllMenu = "QueueAllMenu";
const QueueMenuSatuan = "QueueMenuSatuan";
const QueueMenuByKA = "QueueMenuByKA";
const QueueMenuByPO = "QueueMenuByPO";
const QueueUpMenu = "QueueUpMenu";
const QueueDelMenu = "QueueDelMenu";

const handleQueueMessage = async (channel, queue) => {
  await channel.assertQueue(queue, { durable: false });
  channel.consume(queue, async (message) => {
    if (message !== null) {
      const receivedJSON = JSON.parse(message.content.toString());
      console.log(`Capturing an Event using RabbitMQ to:`, receivedJSON);
      try {
        const newAktivitas = new Aktivitas({
          aktivitas_user: receivedJSON.notification,
          Service: receivedJSON.Service 
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

  
  const listenNewMenu = async (channel) => {
    await handleQueueMessage(channel, QueueMenuBaru);
  };
  
  const listenAllMenu = async (channel) => {
    await handleQueueMessage(channel, QueueAllMenu);
  };
  
  const listenMenuSatuan = async (channel) => {
    await handleQueueMessage(channel, QueueMenuSatuan);
  };

  const listenMenuByKA = async (channel) => {
    await handleQueueMessage(channel, QueueMenuByKA);
  };

  const listenMenuByPO = async (channel) => {
    await handleQueueMessage(channel, QueueMenuByPO);
  };
  
  const listenUpMenu = async (channel) => {
    await handleQueueMessage(channel, QueueUpMenu);
  };
  
  const listenDelMenu = async (channel) => {
    await handleQueueMessage(channel, QueueDelMenu);
  };
  
  module.exports = {
    listenNewMenu,
    listenAllMenu,
    listenMenuSatuan,
    listenMenuByKA,
    listenMenuByPO,
    listenUpMenu,
    listenDelMenu,
  };