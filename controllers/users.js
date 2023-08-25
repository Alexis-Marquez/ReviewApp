const User = require('../models/user');
const ExpressError = require('../utils/ExpressError');

module.exports.renderRegisterForm = (req, res)=>{
    res.render('auth/register');
}

module.exports.register = async(req, res, err)=>{
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
}

module.exports.renderLoginForm = (req, res) =>{
    res.render('auth/login');
}

module.exports.login = (req, res)=>{
    req.flash('success', `Welcome back!`);
    const redirectUrl = res.locals.returnTo || '/places';
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res, next) =>{
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Succesfully logged out');
        res.redirect('/places');
      });
}