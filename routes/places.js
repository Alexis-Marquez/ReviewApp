const express = require('express');
const router = express.Router();
const ExpressError = require('../utils/ExpressError');
const catchAsync = require("../utils/catchAsync");
const joi = require('joi');
const Bussiness = require('../models/Businesses'); //name of model: Bussiness

const categories = ['Restaurant', 'Hotel', 'Gas Station', 'Apparel Store', 'Grocery Store'];

const validatePlace = (req,res,next)=>{ //might move to different file
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

router.get('/',async (req, res)=>{ //Index page
    const places = await Bussiness.find({}); //name of model: Bussiness
    res.render('Places/index', {places});
})
router.delete('/:id', catchAsync(async(req, res, next)=>{
    const {id} = req.params;
    const place = await Bussiness.findByIdAndDelete(id);
    res.redirect('/Places');
    }))

router.get('/new',(req, res)=>{
    res.render('Places/new',{categories});
})

router.post('/', validatePlace, catchAsync(async(req,res, next)=>{
    const place = new Bussiness(req.body.bussiness)
    await place.save();
    res.redirect(`/Places/${place.id}`);
    }))

router.get('/:id/edit', catchAsync(async(req, res, next)=>{
    const place = await Bussiness.findById(req.params.id)
    res.render('Places/edit', {place, categories}) 
}))

router.put('/:id', validatePlace, catchAsync(async(req,res)=>{
    const{id}=req.params;
    const place = await Bussiness.findByIdAndUpdate(id, {...req.body.bussiness})
    res.redirect(`/Places/${place.id}`);
}))

router.get('/:id', catchAsync(async(req, res)=>{
    const place = await Bussiness.findById(req.params.id).populate('reviews')
    res.render('Places/show', {place})
}))

module.exports = router;