const express = require('express');
const router = express.Router();
const OwnedZombie = require('../models/ownedZombie');
<<<<<<< HEAD
const User = require('../models/user')

router.get('/ownedZombieDetail', (req, res, next) => {
    User.findOne({ _id: req.user.id })
        .populate({
            path: 'zombiesOwned',
            populate: { path: 'origin' }
        })
        .populate('gadgetsOwned')
        .then(user => {
            console.log(user);
            let zombieId = req.query.zombie_id;
            OwnedZombie.findOne({ _id: zombieId })
                .populate('origin')
                .then((zombie) => {
                    // console.log(zombie)
                    res.render('../views/profile/ownedZombieDetail.hbs', { zombie })
                })
=======
var secured = require('../lib/middleware/secured');

router.get('/ownedZombieDetail', secured(), (req, res, next) => {
    let zombieId = req.query.zombie_id;
    OwnedZombie.findOne({ _id: zombieId })
        .populate('origin')
        .then((zombie) => {
            console.log(zombie)
            res.render('../views/profile/ownedZombieDetail.hbs', { zombie })
>>>>>>> 06399544fc52dab53285949e0be4dd04356e0919
        })
})

module.exports = router;