const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');

const places = require('./routes/places');
const reviews = require('./routes/reviews');

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


const sessionCongif = {
    secret: 'this',
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7,
        httpOnly: true
    }
}
app.use(session(sessionCongif));
app.use(flash());
app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
app.use('/places', places);
app.use('/places/:id/reviews', reviews);

app.use(express.static(path.join(__dirname,'public')));

app.get('/',(req, res)=>{
    res.render('home');
})

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