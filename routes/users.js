const express = require('express');
const router = express.Router();
const ExpressError = require('../utils/ExpressError');
const catchAsync = require("../utils/catchAsync");
const User = require('../models/user');
const passport = require('passport');

router.get('/register', (req, res)=>{
    res.render('auth/register');
})

router.post('/register', catchAsync(async(req, res, err)=>{
    try{
    const {email, username, password} = req.body;
    const user = new User({email, username});
    const registeredUser = await User.register(user, password); //passport register
    req.login(registeredUser, err=>{
        if(err){
            return next(err);
        }
    req.flash('success','Welcome to places!');
    res.redirect('/places');
    })
    } catch(e){
        req.flash('error', e.message+'. Try again!');
        res.redirect('/register');
    }
}))

router.get('/login', (req, res) =>{
    res.render('auth/login');
})

router.post('/login', passport.authenticate('local', {failureFlash:true, failureRedirect: '/login'}), (req, res)=>{
    req.flash('success', `Welcome back!`);
    res.redirect('/places');
})

router.get('/logout', (req,res, next) =>{
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Succesfully logged out');
        res.redirect('/places');
      });
}) 

module.exports = router;