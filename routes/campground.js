const express = require('express');
const router = express.Router();
const multer  = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })



//support files
const campgrounds = require('../controllers/camgroundsControl.js')
const catchAsync =require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
// const Campground = require('../models/campground');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware.js');


// group routes with similar path


// ('/')
router.route('/')
    .get(catchAsync(campgrounds.index))
    // create
    .post(isLoggedIn, upload.array('image'), validateCampground,  catchAsync(campgrounds.createCampground))
    // .post(upload.array('image'), (req,res)=>{
    //     console.log(req.body, req.files)
    //     res.send("it worked");
    // })

// ceate form   
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

// (/:id)
router.route('/:id')
    .get(isLoggedIn, catchAsync(campgrounds.showCampground))
    // update
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    //  DELETE ROUTE
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

//  edit form
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editForm));


module.exports = router;





// // index
// router.get('/', catchAsync(campgrounds.index));
// // create new
// router.get('/new', isLoggedIn, campgrounds.renderNewForm);
// router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));
// //  show route
// router.get('/:id', isLoggedIn, catchAsync(campgrounds.showCampground))
// //  edit route
// router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editForm));
// router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));
// //  DELETE ROUTE
// router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

