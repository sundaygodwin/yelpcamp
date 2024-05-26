const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressError');
const { cloudinary } = require('../cloudinary')





// index
module.exports.index = async (req, res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
};

//create camp
module.exports.renderNewForm = (req, res)=>{
    res.render('campgrounds/new')
};
module.exports.createCampground = async (req, res, next)=>{
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400)
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({url: f.path, filename:f.filename}))
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'Campground created successfully');
    res.redirect(`/campgrounds/${ campground._id }`);
};

//show page
module.exports.showCampground = async (req, res)=>{
    const campground = await Campground.findById(req.params.id)
    .populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    })
    .populate('author');
    if(!campground){
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
};

// edit routes
module.exports.editForm = async (req, res)=>{
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
};
module.exports.updateCampground = async (req, res)=>{
    const { id } = req.params;
    // console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    const newImages = req.files.map(f => ({url: f.path, filename:f.filename}));
    campground.images.push(...newImages);
    await campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    console.log(campground)
    req.flash('success', 'Campground updated succesfully')
    res.redirect(`/campgrounds/${ campground._id }`);
};

// delete route
module.exports.deleteCampground = async (req, res)=>{
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success', `${ campground.title } deleted`)
    res.redirect('/campgrounds')
};
