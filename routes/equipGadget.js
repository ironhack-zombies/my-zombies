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
    // Gadget.findOne({ _id: gadgetId })


    OwnedGadget.findOne({ _id: gadgetId })
        .populate('origin')
        .then((gadgetToEquip) => {
            console.log(gadgetToEquip)
            OwnedZombie.findOne({ _id: zombieId })
                .populate({
                    path: 'gadgets',
                    populate: { path: 'origin' }
                })
                .then((zombieInSes) => {
                    // console.log(zombieInSes)
                    let gadgetArray = zombieInSes.gadgets;
                    if (gadgetArray) {
                        for (var i = 0; i < gadgetArray.length; i++) {
                            let gadgetType = gadgetToEquip.origin.category;
                            debugger
                            if (gadgetArray[i].origin.category === gadgetType) {
                                let alreadyEquip = gadgetArray[i].id;
                                OwnedGadget.findByIdAndUpdate(alreadyEquip, { $unset: { attachedTo: 1 } }, { new: true })
                                    .then((gad) => {
                                        console.log(gad)
                                    })
                                gadgetArray.splice(i, 1);
                                OwnedZombie.findByIdAndUpdate(zombieId, { gadgets: gadgetArray }, { new: true })
                                i--;
                            }
                        }
                        // return gadgetArray;
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
                        .then((zombNewGad) => {
                            let newgadgetWorn = {
                                attachedTo: mongoose.Types.ObjectId(zombieId)
                            }
                            OwnedGadget.findByIdAndUpdate(gadgetId, newgadgetWorn, { new: true })
                                .then(() => {
                                    res.render('../views/profile/ownedZombieDetail', { zombieNow: zombNewGad });
                                })
                        })
                })
        })
})

module.exports = router;