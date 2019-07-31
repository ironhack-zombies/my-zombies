const express = require('express');
const router = express.Router();
const OwnedZombie = require('../models/ownedZombie');
const OwnedGadget = require('../models/ownedGadget')
var secured = require('../lib/middleware/secured');

router.get('/ownedZombieDetail', secured(), (req, res, next) => {
    OwnedZombie.findOne({
            _id: req.query.zombie_id
        })
        .populate('origin')
        // .populate('gadgets')
        .then((zombieNow) => {
            // find all gadgets owned by current user
            OwnedGadget.find({
                    _id: {
                        '$in': req.user.gadgetsOwned
                    }
                })
                .populate('origin')
                .then((gadgets) => {
                    res.render('../views/profile/ownedZombieDetail.hbs', { zombieNow, gadgets })
                })
        })
})

module.exports = router;