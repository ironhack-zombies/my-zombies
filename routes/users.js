var express = require('express');
var router = express.Router();
const User = require('../models/user')

router.get('/user', (req, res, next) => {
    let userId = req.user._id;
    User.findOne({ _id: userId })
        .populate({
            path: 'zombiesOwned',
            populate: { path: 'origin' }
        })
        .then((user) => {
            res.render('user', { user });
        })

});

module.exports = router;