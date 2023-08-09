const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Bussiness = require('./models/Businesses');

mongoose.connect('mongodb://127.0.0.1:27017/reviews',{
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

app.listen(3000, ()=>{
    
})

app.get('/',(req, res)=>{
    res.render('home');
})
app.get('/Bussiness',async (req, res)=>{
    const places = await Bussiness.find({});
    res.render('Bussiness/index', {places});
})
