const Review = require('../models/review.model');

// Membuat review baru
exports.createReview = async(req, res) => {
    try {
        const newReview = new Review({
            pesan_review: req.body.pesan_review,
            id_cabang: req.body.id_cabang,
            id_menu: req.body.id_menu,
            id_user: req.body.id_user,
            bintang_review: req.body.bintang_review,
        });
        const savedReview = await newReview.save();
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