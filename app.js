const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Bussiness = require('./models/Businesses'); //name of model: Bussiness
const methodOverride = require('method-override')

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


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended:true}));

app.get('/',(req, res)=>{
    res.render('home');
})
app.get('/Places',async (req, res)=>{ //Index page
    const places = await Bussiness.find({}); //name of model: Bussiness
    res.render('Places/index', {places});
})

app.get('/Places/new',(req, res)=>{
    res.render('Places/new')
})

app.post('/Places', async(req,res)=>{
    const place = new Bussiness(req.body.bussiness)
    await place.save();
    res.redirect(`/Places/${place.id}`);
})
app.get('/Places/:id/edit',async(req, res)=>{
    const place = await Bussiness.findById(req.params.id)
    res.render('Places/edit', {place}) 
})

app.put('/places/:id',async(req,res)=>{
    const{id}=req.params;
    const place = await Bussiness.findByIdAndUpdate(id, {...req.body.bussiness})
    res.redirect(`/Places/${place.id}`);
})

app.delete('/places/:id', async(req, res)=>{
    const {id} = req.params;
    const place = await Bussiness.findByIdAndDelete(id);
    res.redirect('/Places');
})

app.get('/Places/:id', async(req, res)=>{
    const place = await Bussiness.findById(req.params.id)
    res.render('Places/show', {place})
})

app.listen(3000, ()=>{
    
})