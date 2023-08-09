const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BussinessSchema = new Schema({
    title: String,
    category: String,
    description: String, 
    location: String,
    price: number
});

module.exports = mongoose.model('Campground', BussinessSchema);