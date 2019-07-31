var express = require('express');
var router = express.Router();
const User = require('../models/user')
const secured = require('../lib/middleware/secured')

router.get('/user', secured(), (req, res, next) => {
    let userId = req.user._id;
    debugger
    User.findOne({ _id: userId })
        .populate({
            path: 'zombiesOwned',
            populate: { path: 'origin' }
        })
        .populate({
            path: 'gadgetsOwned',
            populate: { path: 'origin' }
        })
        .then((user) => {
            res.render('user', { user });
        })

});

module.exports = router;