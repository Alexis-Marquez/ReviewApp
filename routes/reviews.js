const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require("../utils/catchAsync");
const Review = require('../models/review');
const joi = require('joi');
const Bussiness = require('../models/Businesses'); //name of model: Bussiness

const validateReview= (req,res,next)=>{ //might move to different file
    const reviewSchema = joi.object({
        review: joi.object({
            rating:joi.number().required(),
            body: joi.string().required(),
        }).required()
    }) //joi schema for validations
    const {error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el=> el.message).join(',');
        throw new ExpressError(msg, 400)
    }
    else{
        next();
    }
}

router.post('/', validateReview, catchAsync(async(req,res)=>{
    const place = await Bussiness.findById(req.params.id);
    const review = new Review(req.body.review);
    place.reviews.push(review);
    await review.save();
    await place.save();
    req.flash('success',`Successfully created a new review for ${place.name}`)
    res.redirect(`/places/${place._id}`);
}))

router.delete('/:reviewId', catchAsync(async(req, res)=>{
    const{id, reviewId} = req.params
    await Bussiness.findByIdAndUpdate(id, {$pull:{reviews:reviewId}}) //looks for the references in the reviews array and deletes them
    await Review.findByIdAndDelete(reviewId);
    req.flash('success',`Successfully deleted review`)
    res.redirect(`/places/${id}`)
}))

module.exports = router;