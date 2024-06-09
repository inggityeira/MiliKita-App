const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');

router.post('/review', reviewController.createReview);
router.get('/reviews', reviewController.getAllReviews);
router.get('/reviews/:id', reviewController.getReviewById);
router.get('/reviews/cabang/:id_cabang', reviewController.getReviewByCA);
router.get('/reviews/menu/:id_menu', reviewController.getReviewByME);
router.put('/reviews/:id', reviewController.updateReview);
router.delete('/reviews/:id', reviewController.deleteReview);

module.exports = router;