const express = require('express');
const router = express.Router();
const OwnedZombie = require('../models/ownedZombie');
const Gadget = require('../models/gadget')
var secured = require('../lib/middleware/secured');

router.get('/ownedZombieDetail', secured(), (req, res, next) => {
    console.log(req.user.gadgetsOwned)
    Gadget.find({
            _id: {
                '$in': req.user.gadgetsOwned
            },
            category: "Headwear"
        })
        .then(headwear => {
            Gadget.find({
                    _id: {
                        '$in': req.user.gadgetsOwned
                    },
                    category: "Weapon"
                })
                .then(weapon => {
                    console.log(weapon)
                    let zombieId = req.query.zombie_id;
                    OwnedZombie.findOne({ _id: zombieId })
                        .populate('origin')
                        .then((zombie) => {
                            // console.log(zombie)
                            res.render('../views/profile/ownedZombieDetail.hbs', { zombie, headwear, weapon })
                        })
                })

        })
})

module.exports = router;