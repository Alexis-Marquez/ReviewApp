const express = require('express');
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Bussiness = require('../models/Businesses'); //name of model: Bussiness
const {isLoggedIn, isOwner, validatePlace} = require('../utils/middleware');

const categories = ['Restaurant', 'Hotel', 'Gas Station', 'Apparel Store', 'Grocery Store'];

router.get('/',async (req, res)=>{ //Index page
    const places = await Bussiness.find({}); //name of model: Bussiness
    res.render('Places/index', {places});
})
router.delete('/:id', isOwner, catchAsync(async(req, res, next)=>{
    const {id} = req.params;
    await Bussiness.findByIdAndDelete(id);
    req.flash('success',`Successfully deleted place`)
    res.redirect('/Places');
    }))

router.get('/new',isLoggedIn, (req, res)=>{
    res.render('Places/new',{categories});
})

router.post('/', isLoggedIn, validatePlace, catchAsync(async(req,res, next)=>{
    const place = new Bussiness(req.body.bussiness);
    place.owner = req.user._id;
    await place.save();
    req.flash('success', 'Successfully created a new place!');
    res.redirect(`/Places/${place.id}`);
    }))

router.get('/:id/edit', isLoggedIn, isOwner, catchAsync(async(req, res, next)=>{
    const {id} = req.params;
    const place = await Bussiness.findById(id)
    if(!place){
        req.flash('error', 'Place not found')
        return res.redirect('/places');
    }
    res.render('Places/edit', {place, categories}) 
}))

router.put('/:id', validatePlace, isOwner, catchAsync(async(req,res)=>{
    const{id}=req.params;
    const place = await Bussiness.findById(id);
    await Bussiness.findByIdAndUpdate(id, {...req.body.bussiness})
    req.flash('success', 'Successfully updated place!')
    res.redirect(`/Places/${place.id}`);
}))

router.get('/:id', catchAsync(async(req, res)=>{
    const place = await Bussiness.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author' //reviews.author
        }
    }).populate('owner'); //place owner
    if(!place){
        req.flash('error', 'Place not found')
        return res.redirect('/places');
    }
    res.render('Places/show', {place})
}))



module.exports = router;