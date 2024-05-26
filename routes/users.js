const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const  localStrategy = require('passport-local');

const catchAsync =require('../utils/catchAsync');
const { isLoggedIn, storeReturnTo } = require('../middleware');
const users = require('../controllers/userControl')

router.use(passport.initialize());
router.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes

//Register
router.route('/register')
    .get(users.registerForm)
    .post(catchAsync(users.registerNewUser));

// login
router.route('/login')
    .get(users.loginForm)
    .post(
        storeReturnTo, 
        passport.authenticate('local', {
            failureFlash: true, failureRedirect: '/login' 
        }),
        users.loginUser
    );

//logout
router.get('/logout', isLoggedIn, users.logoutUser);

module.exports = router;
