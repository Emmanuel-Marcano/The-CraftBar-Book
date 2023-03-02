const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const Bar = require('../models/Bar')
const Review = require('../models/review')
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware')
const reviews = require('../controllers/reviews')




router.post('/bars/:id/reviews', isLoggedIn, validateReview, catchAsync(reviews.createReview))
router.delete('/bars/:id/reviews/:reviewId', isLoggedIn, isReviewAuthor,  catchAsync(reviews.deleteReview))


module.exports = router