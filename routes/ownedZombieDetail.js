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
        .populate({
            path: 'gadgets',
            populate: { path: 'origin' }
        })
        // .populate('gadgets')
        .then((zombieNow) => {
            // find all gadgets owned by current user
            OwnedGadget.find({
                    _id: {
                        '$in': req.user.gadgetsOwned
                    },
                    attachedTo: null
                })
                .populate('origin')
                .then((gadgets) => {
                    let headwear = [];
                    let weapon = [];
                    let clothing = [];
                    for (var i = 0; i < gadgets.length; i++) {
                        if (gadgets[i].origin.category === "Headwear") {
                            let obj = gadgets[i].origin
                            let id = gadgets[i].id
                            obj.ownedGadId = `${id}`;
                            debugger
                            headwear.push(obj);
                        } else if (gadgets[i].origin.category === "Weapon") {
                            let obj1 = gadgets[i].origin
                            let id1 = gadgets[i].id
                            obj1.ownedGadId = `${id1}`;
                            weapon.push(gadgets[i].origin);
                        } else {
                            clothing.push(gadgets[i].origin);
                            let obj2 = gadgets[i].origin
                            let id2 = gadgets[i].id
                            obj2.ownedGadId = `${id2}`;
                        }
                    }
                    res.render('../views/profile/ownedZombieDetail.hbs', { zombieNow, headwear, weapon, clothing })
                })
        })
})

module.exports = router;