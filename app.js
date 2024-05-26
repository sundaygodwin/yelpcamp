if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
// console.log(process.env.CLOUDINARY_SECRET)


// installed module managers
const express = require('express');
const session = require('express-session')
const path = require('path');
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsmate = require('ejs-mate');
const flash = require('connect-flash');
const passport = require('passport');
const  localStrategy = require('passport-local');
const ExpressMongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');

// js support files
const ExpressError = require('./utils/ExpressError');
const User = require('./models/user');

//routers
const campgrounds = require('./routes/campground.js');
const reviews = require('./routes/review.js')
const users = require('./routes/users.js');


//Set up default mongoose connection
const mongoDB = 'mongodb://localhost:27017/yelp-camp';
const dbUrl = process.env.DB_URL || mongoDB;

mongoose.connect(dbUrl);

//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once("open", ()=>{
    console.log(`Database connected on port ${port}`)
})





const app = express();

app.engine('ejs', ejsmate);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));
//mongo injection
app.use(ExpressMongoSanitize());
// security
app.use(helmet()); //{contentSecurityPolicy: false}

// allowed source
const scriptSrcUrls = [
    "https://stackpath.bootsrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudfare.com/",
    "https://cdn.jsdelivr.net"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootsrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://use.fontawesome.com/",
    "https://fonts.googleapis.com/",
    "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'self'", ...scriptSrcUrls],
            styleSrc: [ "'self'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'", 
                "blob:",
                "data:",
                "https://images.unsplash.com/",
                "https://res.cloudinary.com/ddkdhfgaq/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

const secret = process.env.SECRET || 'Bettersecret';
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret,
    }
});


const sessionConfig = {
    store,
    name: 'Yelpcamp_session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        //secure: true;
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    // console.log(req.quer y);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// Routes


app.use('/', users)
app.use('/campgrounds', campgrounds)
// home
app.get('/', (req, res)=>{

    res.render('home')
})


// Review route
app.use('/campgrounds/:id/reviews', reviews)

//  error handler
app.all('*', (req, res, next)=>{
    next(new ExpressError('Page not found!', 404))
})

app.use((err, req, res, next)=>{
    const {statusCode = 500 } = err;
    if(!err.message) err.message = 'Something went wrong!!!!!!!!!!!!!!!';
    res.status(statusCode).render('error', { err });
})

app.listen(port, ()=>{
    console.log(`Port ${port} is running succesfully!`)
})