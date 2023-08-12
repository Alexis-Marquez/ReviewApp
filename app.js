const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Bussiness = require('./models/Businesses'); //name of model: Bussiness
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError');
const catchAsync = require("./utils/catchAsync");
const joi = require('joi');

mongoose.connect('mongodb://127.0.0.1:27017/reviews',{ //name of database: reviews
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console,"connection error:"));
db.once('open',()=>{
    console.log("Database connnected");
})
const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended:true}));

const categories = ['Restaurant', 'Hotel', 'Gas Station', 'Apparel Store', 'Grocery Store'];

app.get('/',(req, res)=>{
    res.render('home');
})
app.get('/Places',async (req, res)=>{ //Index page
    const places = await Bussiness.find({}); //name of model: Bussiness
    res.render('Places/index', {places});
})
app.delete('/places/:id', catchAsync(async(req, res, next)=>{
    const {id} = req.params;
    const place = await Bussiness.findByIdAndDelete(id);
    res.redirect('/Places');
    }))

app.get('/Places/new',(req, res)=>{
    res.render('Places/new',{categories});
})

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

app.post('/Places', validatePlace, catchAsync(async(req,res, next)=>{
    //if(!req.body.bussiness) throw new ExpressError("Invalid Place Data", 400)
    
    const place = new Bussiness(req.body.bussiness)
    await place.save();
    res.redirect(`/Places/${place.id}`);
    }))
app.get('/Places/:id/edit', catchAsync(async(req, res, next)=>{
    const place = await Bussiness.findById(req.params.id)
    res.render('Places/edit', {place, categories}) 
}))

app.put('/places/:id', validatePlace, catchAsync(async(req,res)=>{
    const{id}=req.params;
    const place = await Bussiness.findByIdAndUpdate(id, {...req.body.bussiness})
    res.redirect(`/Places/${place.id}`);
}))

app.get('/Places/:id', catchAsync(async(req, res)=>{
    const place = await Bussiness.findById(req.params.id)
    res.render('Places/show', {place})
}))
app.all('*', (req,res,next)=>{ //runs when the path doesn't match any previous one
    next(new ExpressError('Page not found', 404))
})
app.use((err,req,res,next)=>{
    const {statusCode = 500}= err;
    if(!err.message) err.message = 'Something went wrong'
    res.status(statusCode).render('error',{err})
})

app.listen(3000, ()=>{
    
})