const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require("../utils/catchAsync");
const Review = require('../models/review');
const Bussiness = require('../models/Businesses'); //name of model: Bussiness
const {validateReview, isLoggedIn, isReviewAuthor} = require('../utils/middleware')

router.post('/', validateReview, isLoggedIn, catchAsync(async(req,res)=>{
    const place = await Bussiness.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    place.reviews.push(review);
    await review.save();
    await place.save();
    req.flash('success',`Successfully created a new review for ${place.name}`)
    res.redirect(`/places/${place._id}`);
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async(req, res)=>{
    const{id, reviewId} = req.params
    await Bussiness.findByIdAndUpdate(id, {$pull:{reviews:reviewId}}) //looks for the references in the reviews array and deletes them
    await Review.findByIdAndDelete(reviewId);
    req.flash('success',`Successfully deleted review`)
    res.redirect(`/places/${id}`)
}))

module.exports = router;