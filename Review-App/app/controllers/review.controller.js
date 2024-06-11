const Review = require("../models/review.model");
const { v4 } = require("uuid");
const amqp = require("amqplib");

let rabbitMQConnection;

// Queue untuk Event Base
const QueueReviewBaru = "QueueReviewBaru";
const QueueAllReview = "QueueAllReview";
const QueueReviewSatuan = "QueueReviewSatuan";
const QueueReviewByCabang = "QueueReviewByCabang";
const QueueReviewByMenu = "QueueReviewByMenu";
const QueueUpReview = "QueueUpReview";
const QueueDelReview = "QueueDelReview";

// Function untuk menghubungkan ke RabbitMQ
async function connectRabbitMQ() {
  if (!rabbitMQConnection) {
    rabbitMQConnection = await amqp.connect("amqp://rabbitmq");
  }
}
exports.connectRabbitMQ = connectRabbitMQ;

// Membuat review baru
exports.createReview = async (req, res) => {
  
  try {
    const key = req.headers.authorization.split(" ")[1]
    console.log(key)

    jwt.verify(key, JWT_SECRET, (err, decoded) => {
        if (err){
            console.log(err)
            res.status(500).send(err)
          // minta token baru
        }

        else {
            console.log('Verified', decoded)
            res.status(200).send(decoded)
        }
    })

    // Simpan review baru ke database
    const newReview = new Review({
      pesan_review: req.body.pesan_review,
      id_cabang: req.body.id_cabang,
      id_menu: req.body.id_menu,
      bintang_review: req.body.bintang_review,
    });
    const savedReview = await newReview.save();

    // Publish pesan ke RabbitMQ
    await connectRabbitMQ();
    const channel = await rabbitMQConnection.createChannel();
    await channel.assertQueue(QueueReviewBaru, { durable: false });

    // Pesan untuk publish
    const message = {
      notification: `Membuat review baru, yaitu: ${req.body.pesan_review}`,
      Service: "Review",
    };

    // Kirim pesan ke queue
    channel.sendToQueue(QueueReviewBaru, Buffer.from(JSON.stringify(message)));
    console.log(`Publishing an Event using RabbitMQ: ${message.notification}`);
    await channel.close();

    res.status(201).send(savedReview);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Read Review keseluruhan
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();

    // Publish pesan ke RabbitMQ
    await connectRabbitMQ();

    const channel = await rabbitMQConnection.createChannel();
    await channel.assertQueue(QueueAllReview, { durable: false });

    // Pesan untuk publish
    const message = {
      notification: "Melihat seluruh review",
      Service: "Review",
    };

    // Kirim pesan ke queue
    channel.sendToQueue(QueueAllReview, Buffer.from(JSON.stringify(message)));
    console.log(`Publishing an Event using RabbitMQ: ${message.notification}`);

    await channel.close();

    res.status(200).send(reviews);
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(400).send({ error: "Failed to retrieve reviews or publish message to RabbitMQ", details: error.message });
  }
};

// Read Review satuan
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findOne({ id_review: req.params.id });
    if (!review) {
      return res.status(404).send({ message: "Review not found" });
    }
    // Publish pesan ke RabbitMQ
    await connectRabbitMQ();
    const channel = await rabbitMQConnection.createChannel();
    await channel.assertQueue(QueueReviewSatuan, { durable: false });

    // Pesan untuk publish
    const message = {
      notification: `Melihat Review Satuan dengan id ${req.params.id}`,
      Service: "Review",
    };

    // Kirim pesan ke queue
    channel.sendToQueue(QueueReviewSatuan, Buffer.from(JSON.stringify(message)));
    console.log(`Publishing an Event using RabbitMQ: ${message.notification}`);
    await channel.close();

    res.status(200).send(review);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Read Review By Cabang
exports.getReviewByCA = async (req, res) => {
  try {
    const review = await Review.find({ id_cabang: req.params.id_cabang });
    if (!review) {
      return res.status(404).send({ message: "Review not found" });
    }
    // Publish pesan ke RabbitMQ
    await connectRabbitMQ();
    const channel = await rabbitMQConnection.createChannel();
    await channel.assertQueue(QueueReviewByCabang, { durable: false });

    // Pesan untuk publish
    const message = {
      notification: `Melihat Review berdasarkan cabang dengan id: ${req.params.id_cabang}`,
      Service: "Review",
    };

    // Kirim pesan ke queue
    channel.sendToQueue(QueueReviewByCabang, Buffer.from(JSON.stringify(message)));
    console.log(`Publishing an Event using RabbitMQ: ${message.notification}`);
    await channel.close();

    res.status(200).send(review);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Read Review By Menu
exports.getReviewByME = async (req, res) => {
  try {
    const review = await Review.find({ id_menu: req.params.id_menu });
    if (!review) {
      return res.status(404).send({ message: "Review not found" });
    }
    // Publish pesan ke RabbitMQ
    await connectRabbitMQ();
    const channel = await rabbitMQConnection.createChannel();
    await channel.assertQueue(QueueReviewByMenu, { durable: false });

    // Pesan untuk publish
    const message = {
      notification: `Melihat Review berdasarkan menu dengan id: ${req.params.id_menu}`,
      Service: "Review",
    };

    // Kirim pesan ke queue
    channel.sendToQueue(QueueReviewByMenu, Buffer.from(JSON.stringify(message)));
    console.log(`Publishing an Event using RabbitMQ: ${message.notification}`);
    await channel.close();

    res.status(200).send(review);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Update review
exports.updateReview = async (req, res) => {
  try {
    const updatedReview = await Review.findOneAndUpdate({ id_review: req.params.id }, req.body, { new: true });
    if (!updatedReview) {
      return res.status(404).send({ message: "Review not found" });
    }

    // Publish pesan ke RabbitMQ
    await connectRabbitMQ();
    const channel = await rabbitMQConnection.createChannel();
    await channel.assertQueue(QueueUpReview, { durable: false });

    // Pesan untuk publish
    const message = {
      notification: `Melakukan perubahan pada review dengan id ${req.params.id}`,
      Service: "Review",
    };

    // Kirim pesan ke queue
    channel.sendToQueue(QueueUpReview, Buffer.from(JSON.stringify(message)));
    console.log(`Publishing an Event using RabbitMQ: ${message.notification}`);
    await channel.close();

    res.status(200).send(updatedReview);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete Review
exports.deleteReview = async (req, res) => {
  try {
    const deletedReview = await Review.findOneAndDelete({ id_review: req.params.id });
    if (!deletedReview) {
      return res.status(404).send({ message: "Review not found" });
    }

    // Publish pesan ke RabbitMQ
    await connectRabbitMQ();
    const channel = await rabbitMQConnection.createChannel();
    await channel.assertQueue(QueueDelReview, { durable: false });

    // Pesan untuk publish
    const message = {
      notification: `Melakukan penghapusan pada review dengan id ${req.params.id}`,
      Service: "Review",
    };

    // Kirim pesan ke queue
    channel.sendToQueue(QueueDelReview, Buffer.from(JSON.stringify(message)));
    console.log(`Publishing an Event using RabbitMQ: ${message.notification}`);
    await channel.close();

    res.status(200).send({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(400).send(error);
  }
};
