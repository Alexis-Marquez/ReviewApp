const Bussiness = require('../models/Businesses'); //name of model: Bussiness
const categories = ['Restaurant', 'Hotel', 'Gas Station', 'Apparel Store', 'Grocery Store'];

module.exports.index = async (req, res)=>{ //Index page
    const places = await Bussiness.find({}); //name of model: Bussiness
    res.render('Places/index', {places});
}
module.exports.renderNewForm = (req, res)=>{
    res.render('Places/new',{categories});
}

module.exports.deletePlace = async(req, res, next)=>{
    const {id} = req.params;
    await Bussiness.findByIdAndDelete(id);
    req.flash('success',`Successfully deleted place`)
    res.redirect('/Places');
    }

module.exports.createPlace = async(req,res, next)=>{
    const place = new Bussiness(req.body.bussiness);
    place.owner = req.user._id;
    await place.save();
    req.flash('success', 'Successfully created a new place!');
    res.redirect(`/Places/${place.id}`);
    }

module.exports.renderEditForm = async(req, res, next)=>{
    const {id} = req.params;
    const place = await Bussiness.findById(id)
    if(!place){
        req.flash('error', 'Place not found')
        return res.redirect('/places');
    }
    res.render('Places/edit', {place, categories}) 
}

module.exports.editPlace = async(req,res)=>{
    const{id}=req.params;
    const place = await Bussiness.findById(id);
    await Bussiness.findByIdAndUpdate(id, {...req.body.bussiness})
    req.flash('success', 'Successfully updated place!')
    res.redirect(`/Places/${place.id}`);
}

module.exports.renderShowPlace = async(req, res)=>{
    const place = await Bussiness.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author' //reviews.author
        }
    }).populate('owner'); //place owner
    if(!place){
        req.flash('error', 'Place not found')
        return res.redirect('/places');
    }
    res.render('Places/show', {place})
}