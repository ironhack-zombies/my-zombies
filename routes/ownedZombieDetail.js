const express = require('express');
const router = express.Router();
const OwnedZombie = require('../models/ownedZombie');
var secured = require('../lib/middleware/secured');

router.get('/ownedZombieDetail', secured(), (req, res, next) => {
    let zombieId = req.query.zombie_id;
    OwnedZombie.findOne({ _id: zombieId })
        .populate('origin')
        .then((zombie) => {
            console.log(zombie)
            res.render('../views/profile/ownedZombieDetail.hbs', { zombie })
        })
})

module.exports = router;