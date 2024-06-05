const Review = require('../models/review.model');
const { v4 } = require('uuid');
const amqp = require('amqplib');

let rabbitMQConnection;
const QueueReviewBaru = "QueueReviewBaru";

// Function untuk menghubungkan ke RabbitMQ
async function connectRabbitMQ() {
    if (!rabbitMQConnection) {
      rabbitMQConnection = await amqp.connect('amqp://rabbitmq');
    }
  }

// Function untuk menghubungkan ke RabbitMQ
exports.connectRabbitMQ = connectRabbitMQ;

// Membuat review baru
exports.createReview = async (req, res) => {
    try {
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
        message: req.body.pesan_review,
        notification: "Ada review baru nih!",
      };
  
      // Kirim pesan ke queue
      channel.sendToQueue(QueueReviewBaru, Buffer.from(JSON.stringify(message)));
      console.log(`Publishing an Event using RabbitMQ: ${req.body.pesan_review}`);
      await channel.close();
  
      res.status(201).send(savedReview);
    } catch (error) {
      res.status(400).send(error);
    }
  };

// Read Review keseluruhan
exports.getAllReviews = async(req, res) => {
    try {
        const reviews = await Review.find();
        res.status(200).send(reviews);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Read Review satuan
exports.getReviewById = async(req, res) => {
    try {
        const review = await Review.findOne({ id_review: req.params.id });
        if (!review) {
            return res.status(404).send({ message: 'Review not found' });
        }
        res.status(200).send(review);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Update review
exports.updateReview = async(req, res) => {
    try {
        const updatedReview = await Review.findOneAndUpdate(
            { id_review: req.params.id },
            req.body,
            { new: true }
        );
        if (!updatedReview) {
            return res.status(404).send({ message: 'Review not found' });
        }
        res.status(200).send(updatedReview);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete Review
exports.deleteReview = async(req, res) => {
    try {
        const deletedReview = await Review.findOneAndDelete({ id_review: req.params.id });
        if (!deletedReview) {
            return res.status(404).send({ message: 'Review not found' });
        }
        res.status(200).send({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(400).send(error);
    }
};