const express = require('express')
const app = express()

const connectDB = require('./app/config/database');
const reviewRoutes = require('./app/routes/review.routes');
const PORT = process.env.PORT || 5000;


// register middleware
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// connect database dan port
connectDB();

// membuat routes
app.use('/', reviewRoutes);

const amqp = require('amqplib');

async function connect() {
  try {
    const connection = await amqp.connect('amqp://rabbitmq');
    const channel = await connection.createChannel();
    const queue = 'review';

    await channel.assertQueue(queue, {
      durable: false
    });

    console.log('Review App is running...');

    setInterval(() => {
      const review = {
        content: 'This is a sample review'
      };

      channel.sendToQueue(queue, Buffer.from(JSON.stringify(review)));
      console.log('Review sent:', review);
    }, 5000);
  } catch (error) {
    console.error(error);
  }
}

connect();


// Port
app.listen(PORT, () => {
    console.log(`😀 server on port ${PORT}`);
});

