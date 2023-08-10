const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BussinessSchema = new Schema({
    name: String,
    category: String,
    image: String,
    description: String, 
    location: String,
    price: Number
});

module.exports = mongoose.model('Bussiness', BussinessSchema);