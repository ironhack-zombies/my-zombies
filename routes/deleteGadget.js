const express = require('express');
const router = express.Router();
const OwnedGadget = require('../models/ownedGadget');
const OwnedZombie = require('../models/ownedZombie');

router.post('/deleteGadget/:id', (req, res, next) => {
    debugger
    let gadgetId = req.params.id;
    OwnedGadget.findById(gadgetId)
        .then((gadget) => {
            let zombieId = gadget.attachedTo;
            OwnedZombie.findById(zombieId)
                .populate({
                    path: 'gadgets',
                    populate: { path: 'origin' }
                })
                .then((zombie) => {
                    let gadgetsArr = zombie.gadgets;
                    for (var i = 0; i < gadgetsArr.length; i++) {
                        if (gadgetsArr[i].id === gadgetId) {
                            gadgetsArr.splice(i, 1)
                            i--
                        }
                    }
                    OwnedZombie.updateOne({ _id: zombieId }, { gadgets: gadgetsArr }, { new: true })
                        .then((updateZomb) => {
                            OwnedGadget.updateOne({ _id: gadgetId }, { $unset: { attachedTo: 1 } }, { new: true })
                                .then((gadget) => {
                                    res.send({ gadgetDel: gadgetId })

                                })
                        })
                })
        })
        // OwnedGadget.updateOne({ _id: gadgetId }, { $unset: { attachedTo: 1 } }, { new: true })
        //     .then((gadget) => {
        //         let zombieId = gadget.attachedTo;
        //         OwnedZombie.findById(zombieId)
        //             .then((zombie) => {
        //                 let gadgetsArr = zombie.gadgets;
        //                 for (var i = 0; i < gadgetsArr.length; i++) {
        //                     if (gadgetsArr[i]._id === gadgetId) {
        //                         gadgetsArr.splice(i, 1)
        //                     }
        //                 }
        //                 OwnedZombie.updateOne({ _id: zombieId }, { gadgets: gadgetsArr }, { new: true })
        //                     .then((updateZomb) => {
        //                         res.send({ message: deleted })
        //                     })
        //             })
        // })

})
module.exports = router;