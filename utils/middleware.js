const ExpressError = require('./ExpressError');
const joi = require('joi');
const Bussiness = require('../models/Businesses'); //name of model: Bussiness
const Review = require('../models/review');

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){ //middleware that checks if someone is logged in session
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'Please sign in!');
    return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateReview= (req,res,next)=>{
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

module.exports.validatePlace = (req,res,next)=>{ //might move to different file
    const placeSchema = joi.object({
        bussiness: joi.object({
            name:joi.string().required(),
            image: joi.string().required(),
            location: joi.string().required(),
            description: joi.string().required(),
            category: joi.string().required()
        }).required()
    }) //joi schema for validations
    const {error} = placeSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el=> el.message).join(',');
        throw new ExpressError(msg, 400)
    }
    else{
        next();
    }
}

module.exports.isOwner = async(req,res,next)=>{
    const {id} = req.params;
    const place = await Bussiness.findById(id);
    if(!place.owner.equals(req.user._id)){
        req.flash('error', "You don't have permission to do that");
        return res.redirect(`/places/${id}`)
    }
    next();
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', "You don't have permission to do that");
        return res.redirect(`/places/${id}`)
    }
    next();
}