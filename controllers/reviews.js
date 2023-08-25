const Review = require('../models/review');
const Bussiness = require('../models/Businesses'); //name of model: Bussiness

module.exports.createReview = async(req,res)=>{
    const place = await Bussiness.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    place.reviews.push(review);
    await review.save();
    await place.save();
    req.flash('success',`Successfully created a new review for ${place.name}`)
    res.redirect(`/places/${place._id}`);
}

module.exports.deleteReview = async(req, res)=>{
    const{id, reviewId} = req.params
    await Bussiness.findByIdAndUpdate(id, {$pull:{reviews:reviewId}}) //looks for the references in the reviews array and deletes them
    await Review.findByIdAndDelete(reviewId);
    req.flash('success',`Successfully deleted review`)
    res.redirect(`/places/${id}`)
}