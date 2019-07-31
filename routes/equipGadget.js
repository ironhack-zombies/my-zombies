const express = require('express');
const router = express.Router();
const Gadget = require('../models/gadget');
const User = require('../models/user');
const OwnedZombie = require('../models/ownedZombie');
const mongoose = require('mongoose');

router.get('/equip', (req, res, next) => {
    let gadgetId = req.query.gadget_id;
    let zombieId = req.query.zombie_id;
    Gadget.findOne({ _id: gadgetId })
        .then((gadgetToAdd) => {
            OwnedZombie.findOne({ _id: zombieId })
                .populate('gadgets')
                .then((zombie) => {
                    let gadgetArr = zombie.gadgets;
                    if (gadgetArr) {
                        debugger
                        for (var i = 0; i < gadgetArr.length; i++) {
                            let gadgetType = gadgetToAdd.category;
                            if (gadgetArr[i].category === gadgetType) {
                                let alreadyEquip = gadgetArr[i]._id
                                Gadget.findByIdAndUpdate(alreadyEquip, { attachedTo: null }, { new: true })
                                arr.splice(i, 1);
                                i--;
                            }
                        }
                    }

                    gadgetArr.push(mongoose.Types.ObjectId(gadgetId))
                    let newGadget = {
                        gadgets: gadgetArr
                    }
                    OwnedZombie.findByIdAndUpdate(zombieId, newGadget, {
                            new: true
                        })
                        .populate('gadgets')
                        .populate('origin')
                        .then((zombie) => {
                            let newgadgetWorn = {
                                attachedTo: mongoose.Types.ObjectId(zombieId)
                            }
                            Gadget.findByIdAndUpdate(gadgetId, newgadgetWorn, { new: true })
                                .then((gadget) => {
                                    console.log(zombie)
                                    res.redirect('/user')
                                        // res.render('../views/profile/ownedZombieDetail', { zombie });
                                })
                        })


                })



            // OwnedZombie.findOne({ _id: zombieId })
            //     .populate('gadgets')
            //     .then((zombie) => {
            //         if (zombie.gadgets.category === "")
            //             let gadgetArr = zombie.gadgets;
            //         let newGad = mongoose.Types.ObjectId(gadgetId);
            //         newGadget = {
            //             gadgets: newGad
            //         }
            //         OwnedZombie.findByIdAndUpdate(zombieId, newGadget, {
            //                 new: true
            //             })
            //             .populate('gadgets')
            //             .then((zombie) => {
            //                 let newgadgetWorn = {
            //                     attachedTo: mongoose.Types.ObjectId(zombieId)
            //                 }
            //                 Gadget.findByIdAndUpdate(gadgetId, newgadgetWorn, { new: true })
            //                     .then((gadget) => {
            //                         console.log(zombie)
            //                         res.render('../views/profile/ownedZombieDetail', { zombie });
            //                     })
            //             })
        })
})

module.exports = router;