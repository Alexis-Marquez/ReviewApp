const express = require('express');
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Bussiness = require('../models/Businesses'); //name of model: Bussiness
const {isLoggedIn, isOwner, validatePlace} = require('../utils/middleware');
const places = require('../controllers/places')

router.route('/')
    .get(catchAsync(places.index))
    .post(isLoggedIn, validatePlace, catchAsync(places.createPlace));

router.get('/new',isLoggedIn, places.renderNewForm);

router.route('/:id')
    .delete(isOwner, catchAsync(places.deletePlace))
    .put(validatePlace, isOwner, catchAsync(places.editPlace))
    .get(catchAsync(places.renderShowPlace))

router.get('/:id/edit', isLoggedIn, isOwner, catchAsync(places.renderEditForm));

module.exports = router;