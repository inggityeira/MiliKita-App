const express = require('express')
const app = express()

const PORT = process.env.PORT || 5004;


// register middleware
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get('/', function (req, res) {
    res.send('Hello World')
  })

// Event Base
const amqp = require('amqplib');

async function connect() {
  try {
    const connection = await amqp.connect('amqp://rabbitmq');
    const channel = await connection.createChannel();
    const queue = 'review';

    await channel.assertQueue(queue, {
      durable: false
    });

    console.log('Notif App is running...');

    channel.consume(queue, (message) => {
      if (message !== null) {
        const review = JSON.parse(message.content.toString());
        console.log('Review received:', review);

        // Implement your notification logic here
      }
    }, {
      noAck: true
    });
  } catch (error) {
    console.error(error);
  }
}

connect();



// Port
app.listen(PORT, () => {
    console.log(`😀 server on port ${PORT}`);
});

