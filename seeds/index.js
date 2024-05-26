const mongoose = require('mongoose');
const Campground = require('../models/campground')
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers')

//Set up default mongoose connection
var mongoDB = 'mongodb://localhost:27017/yelp-camp';
mongoose.connect(mongoDB);
;
//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once("open", ()=>{
    console.log('Database connected')
});

const sample = (arr)=> arr[Math.floor(Math.random() * arr.length)];

const seedDB = async ()=> {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '66342fd55c0895bbf853815d',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [ 
                {
                    url: 'https://res.cloudinary.com/ddkdhfgaq/image/upload/v1715608286/YelpCamp/lhu3nr5ut7uxll9ffd3u.png',
                    filename: 'YelpCamp/lhu3nr5ut7uxll9ffd3u',
                },
                {
                    url: 'https://res.cloudinary.com/ddkdhfgaq/image/upload/v1715608431/YelpCamp/mmil1wymvqmmfgk7lynk.jpg',
                    filename: 'YelpCamp/mmil1wymvqmmfgk7lynk',
                }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repudiandae dolore delectus fuga placeat deleniti aperiam ut ea, eligendi nesciunt debitis corporis, iste nostrum facilis voluptate! Labore accusantium deserunt alias atque',
            price,
        })
        await camp.save();
    }
}
seedDB().then(()=>{
    mongoose.connection.close();
})