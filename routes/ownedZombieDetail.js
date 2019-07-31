const express = require('express');
const router = express.Router();
const OwnedZombie = require('../models/ownedZombie');
const Gadget = require('../models/gadget')
var secured = require('../lib/middleware/secured');

router.get('/ownedZombieDetail', secured(), (req, res, next) => {
    Gadget.find({
            _id: {
                '$in': req.user.gadgetsOwned
            },
            category: "Headwear",
            attachedTo: null
        })
        .then(headwear => {
            Gadget.find({
                    _id: {
                        '$in': req.user.gadgetsOwned
                    },
                    category: "Weapon",
                    attachedTo: null
                })
                .then(weapon => {
                    Gadget.find({
                            _id: {
                                '$in': req.user.gadgetsOwned
                            },
                            category: "Clothing",
                            attachedTo: null
                        })
                        .then(clothing => {
                            let zombieId = req.query.zombie_id;
                            OwnedZombie.findOne({ _id: zombieId })
                                .populate('origin')
                                .populate('gadgets')
                                .then((zombie) => {
                                    console.log(clothing)
                                    res.render('../views/profile/ownedZombieDetail.hbs', { zombie, headwear, weapon, clothing })
                                })
                        })
                })

        })
})

module.exports = router;