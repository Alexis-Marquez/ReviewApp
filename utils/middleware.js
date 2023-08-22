const isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){ //middleware that checks if someone is logged in session
    req.flash('error', 'Please sign in!');
    return res.redirect('/login');
    }
    next();
}

module.exports = isLoggedIn;