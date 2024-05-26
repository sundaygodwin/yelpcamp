const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('../models/review');

//https://res.cloudinary.com/ddkdhfgaq/image/upload/w_100,h_150/v1715642559/YelpCamp/hkn46bewbrzlohqlzbzj.jpg

const ImageSchema = new Schema({
    url: String,
    filename: String,
});
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200,h_200')
});
const CampgroundSchema = new Schema({
    title: String,
    images:[ImageSchema],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    
})

CampgroundSchema.post('findOneAndDelete', async function (doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in: doc.reviews
            }
        })
    }
})


module.exports = mongoose.model('Campground', CampgroundSchema);