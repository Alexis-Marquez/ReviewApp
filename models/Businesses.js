const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const BussinessSchema = new Schema({
    name: String,
    category: String,
    image: String,
    description: String, 
    location: String,
    price: Number,
    reviews: [
        {
        type: Schema.Types.ObjectId,
        ref: 'Review'
        }
    ]
});

BussinessSchema.post('findOneAndDelete', async function(doc){ // mongoose middleware that deletes all reviews under a deleted place
    if(doc){
        await Review.deleteMany({
            _id:{
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Bussiness', BussinessSchema);