const express = require('express');
const router = express.Router();
const OwnedGadget = require('../models/ownedGadget');
const User = require('../models/user');
const OwnedZombie = require('../models/ownedZombie');
const Gadget = require('../models/gadget')
const mongoose = require('mongoose');

router.get('/equip', (req, res, next) => {
    let gadgetId = req.query.gadget_id;
    let zombieId = req.query.zombie_id;

    OwnedGadget.findByIdAndUpdate(gadgetId, { $set: { attachedTo: zombieId } }, { new: true })
        .populate('origin')
        .then((gadgetToEquip) => {
            OwnedZombie.findOne({ _id: zombieId })
                .populate({
                    path: 'gadgets',
                    populate: { path: 'origin' }
                })
                .then((zombieInSes) => {
                    let gadgetArray = zombieInSes.gadgets;
                    if (gadgetArray) {
                        for (var i = 0; i < gadgetArray.length; i++) {
                            let gadgetType = gadgetToEquip.origin.category;
                            debugger
                            if (gadgetArray[i].origin.category === gadgetType) {
                                let alreadyEquip = gadgetArray[i]._id;
                                OwnedGadget.updateOne({ _id: alreadyEquip }, { $unset: { attachedTo: 1 } }, { new: true })
                                    .catch((err) => {
                                        console.log(err)
                                    })
                                gadgetArray.splice(i, 1);
                                OwnedZombie.findByIdAndUpdate(zombieId, { gadgets: gadgetArray }, { new: true })
                                i--
                            }
                        }
                    }
                    let gadId = mongoose.Types.ObjectId(gadgetId)
                    gadgetArray.push(gadId);
                    let zombieWithNewGad = {
                        gadgets: gadgetArray
                    }
                    OwnedZombie.findByIdAndUpdate(zombieId, zombieWithNewGad, { new: true })
                        .populate({
                            path: 'gadgets',
                            populate: { path: 'origin' }
                        })
                        .populate('origin')
                        .then((zombieNow) => {
                            // let newgadgetWorn = {
                            //     attachedTo: zombieNow._id
                            // }
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
        })
})

module.exports = router;