const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Bussiness = require('./models/Businesses'); //name of model: Bussiness

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

app.listen(3000, ()=>{
    
})

app.get('/',(req, res)=>{
    res.render('home');
})
app.get('/Places',async (req, res)=>{ //Index page
    const places = await Bussiness.find({}); //name of model: Bussiness
    res.render('Places/index', {places});
})
