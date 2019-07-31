var express = require('express');
var router = express.Router();
const User = require('../models/user')
const secured = require('../lib/middleware/secured')

router.get('/user', secured(), (req, res, next) => {
    let userId = req.user._id;
    User.findOne({ _id: userId })
        .populate({
            path: 'zombiesOwned',
            populate: { path: 'origin' }
        })
        .populate('gadgetsOwned')
        .then((user) => {
            console.log(user);
            res.render('user', { user });
        })

});

module.exports = router;