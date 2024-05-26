const Campground = require('../models/campground.js');
const Review = require('../models/review.js');
const ExpressError = require('../utils/ExpressError.js');


// create review
module.exports.createReview = async (req, res)=>{
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Review added successfully!')
    res.redirect(`/campgrounds/${campground._id}`);
};

// delete review
module.exports.deleteReview = async (req, res)=>{
    const { id, reviewID } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
    await Review.findByIdAndDelete(reviewID);
    req.flash('success', 'a review deleted!')
    res.redirect(`/campgrounds/${id}`)
}