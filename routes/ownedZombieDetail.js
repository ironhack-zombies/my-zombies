const express = require('express');
const router = express.Router();
const OwnedZombie = require('../models/ownedZombie');
const User = require('../models/user')
var secured = require('../lib/middleware/secured');

router.get('/ownedZombieDetail', secured(), (req, res, next) => {
    User.findOne({ _id: req.user.id })
        .populate({
            path: 'zombiesOwned',
            populate: { path: 'origin' }
        })
        .populate('gadgetsOwned')
        .then(user => {
            let zombieId = req.query.zombie_id;
            OwnedZombie.findOne({ _id: zombieId })
                .populate('origin')
                .then((zombie) => {
                    res.render('../views/profile/ownedZombieDetail.hbs', { zombie, user })
                })
        })
})

module.exports = router;