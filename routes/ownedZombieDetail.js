const express = require('express');
const router = express.Router();
const OwnedZombie = require('../models/ownedZombie');
const OwnedGadget = require('../models/ownedGadget')
var secured = require('../lib/middleware/secured');
const mongoose = require('mongoose');

router.get('/ownedZombieDetail', secured(), (req, res, next) => {
    OwnedZombie.findOne({
            _id: req.query.zombie_id
        })
        .populate('origin')
        .populate('currentState')
        .populate({
            path: 'gadgets',
            populate: { path: 'origin' }
        })
        .then((zombieNow) => {
            // if action running calc minutes left
            if (zombieNow.currentState) {
                zombieNow.currentState.minutes = Math.floor(Math.abs(zombieNow.currentState.end.getTime() - new Date().getTime()) / 60000)
            }
            // find all gadgets owned by current user
            OwnedGadget.find({
                    _id: {
                        '$in': req.user.gadgetsOwned
                    },
                    attachedTo: undefined
                })
                .populate({
                    path: 'origin'
                })
                .then((gadgetArr) => {
                    function filterHeadwear(obj) {
                        if (obj.origin.category === 'Headwear') {
                            return true;
                        } else {
                            return false;
                        }
                    }

                    function filterWeapon(obj) {
                        if (obj.origin.category === 'Weapon') {
                            return true;
                        } else {
                            return false;
                        }
                    }

                    function filterClothing(obj) {
                        if (obj.origin.category === 'Clothing') {
                            return true;
                        } else {
                            return false;
                        }
                    }
                    var headwear = gadgetArr.filter(filterHeadwear);
                    var weapon = gadgetArr.filter(filterWeapon);
                    var clothing = gadgetArr.filter(filterClothing);
                    res.render('../views/profile/ownedZombieDetail.hbs', { zombieNow, headwear, weapon, clothing })
                })
        })
})

module.exports = router;