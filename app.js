const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Bussiness = require('./models/Businesses');

mongoose.connect('mongodb://127.0.0.1:27017/camps',{
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
app.get('/Bussinesss',async (req, res)=>{
    const Bussinesss = await Bussiness.find();
    res.render('Bussinesss/index');
})

app.get('/makeBussiness', async (req, res)=>{
    const bussiness = new Bussiness({title: 'back'})
    await bussiness.save();
    res.send(bussiness);
})