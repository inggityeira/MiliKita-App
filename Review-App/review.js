const express = require('express')
const app = express()

const connectDB = require('./app/config/database');
const reviewRoutes = require('./app/routes/review.routes');
const PORT = process.env.PORT || 5000;

const { v4 } = require('uuid');
const amqp = require('amqplib');

// register middleware
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// connect database dan port
connectDB();

// membuat routes
app.use('/', reviewRoutes);

// Event Base
let rabbitMQConnection;
const queueName = "MessageQueue";

app.post('/messages', async (req, res) => {
  try {

    if (!req.body?.message) {
      return res.status(400).json({
        detail: "The message property is required"
      });
    }

    const message = {
      id: v4(),
      message: req.body.message,
      date: new Date(),
    };

    const channel = await rabbitMQConnection.createChannel();
    await channel.assertQueue(queueName, { durable: false });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
    console.log(`Publishing an Event using RabbitMQ to :${req.body.message}`);
    await channel.close();
    return res.json({
      detail: 'Publishing an Event using RabbitMQ successful',
    });
  } catch (error) {
    return res.status(500).json({
      detail: error.message
    });
  }
});

// Port
amqp.connect('amqp://rabbitmq').then(connection => {
  rabbitMQConnection = connection;
  app.listen(PORT, () => {
    console.log(` 😀 server on port ${PORT}  `);
  });
});

