const express = require('express');
const router = express.Router({mergeParams: true});


// const Campground = require('../models/campground');
// const Review = require('../models/review.js');
const reviews = require('../controllers/reviewsControl.js')
// const { reviewSchema } = require('../schemas.js')
const catchAsync =require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware.js');


// review routes
router.post('/', isLoggedIn, validateReview ,  catchAsync(reviews.createReview));

// delete review
router.delete('/:reviewID', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))


module.exports = router;