const express = require('express');
const app = express();
const PORT = 5004;
const amqp = require('amqplib');

let rabbitMQConnection;
const QueueReviewBaru = "QueueReviewBaru";
const messagesStorage = [];

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/messages', (req, res) => {
  try {
    return res.json({ messages: messagesStorage });
  } catch (error) {
    return res.status(500).json({
      detail: error.message
    });
  }
});

// Subscribe New Review
async function listenNewReview() {
  const channel = await rabbitMQConnection.createChannel();
  await channel.assertQueue(QueueReviewBaru, { durable: false });
  channel.consume(QueueReviewBaru, (message) => {
    if (message !== null) {
      const receivedJSON = JSON.parse(message.content.toString());
      console.log(`Capturing an Event using RabbitMQ to:`, receivedJSON);
      messagesStorage.push(receivedJSON);
      channel.ack(message);
    }
  });
}

amqp.connect('amqp://localhost').then(async (connection) => {
  rabbitMQConnection = connection;
  listenNewReview();
  app.listen(PORT, () => {
    console.log(` 😀 server on port ${PORT}  `);
  });
});