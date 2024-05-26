const User = require('../models/user');


// Register route
module.exports.registerForm = (req, res)=>{
    res.render('users/register')
};

module.exports.registerNewUser = async (req, res)=>{
    try{
        const {username, email, password} = req.body;
        const newUser = new User({username, email});
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, err =>{
            if(err) return next(err);
            req.flash('success',"Registration successful")
            res.redirect('/campgrounds');
        })
        
    }catch(e){
        req.flash('error', e.message)
        res.redirect('/register');
    }  
};

// login routes
module.exports.loginForm = (req, res)=>{
    res.render('users/login')
};
module.exports.loginUser = (req, res)=>{
    req.flash('success', `Welcome, ${req.user.username}`);
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
};

// logout route
module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/');
    });
};