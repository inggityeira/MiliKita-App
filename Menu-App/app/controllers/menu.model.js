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