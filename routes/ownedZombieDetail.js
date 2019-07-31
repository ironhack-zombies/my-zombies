const express = require('express');
const router = express.Router();
const OwnedZombie = require('../models/ownedZombie');
// const User = require('../models/')

router.get('/ownedZombieDetail', (req, res, next) => {
    let zombieId = req.query.zombie_id;
    OwnedZombie.findOne({ _id: zombieId })
        .populate('origin')
        .then((zombie) => {
            console.log(zombie)
            res.render('../views/profile/ownedZombieDetail.hbs', { zombie })
        })
})

module.exports = router;