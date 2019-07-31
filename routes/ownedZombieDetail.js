const express = require('express');
const router = express.Router();
const OwnedZombie = require('../models/ownedZombie');
const OwnedGadget = require('../models/ownedGadget')
var secured = require('../lib/middleware/secured');

router.get('/ownedZombieDetail', secured(), (req, res, next) => {
    OwnedZombie.find({
            _id: req.query.zombie_id
        })
        .populate('origin')
        .then((zombieNow) => {
            // find all gadgets owned by current user
            OwnedGadget.find({
                    _id: {
                        '$in': req.user.gadgetsOwned
                    }
                })
                .populate('origin')
                .then((gadgets) => {
                    let headwear = []
                    for (var i = 0; i <= gadgets.length; i++) {
                        if (gadgets[i].origin.category === "Headwear") {
                            let newheadwear = gadgets[i].origin;
                            headwear.push(newheadwear);
                        }
                    }
                    console.log(headwear);
                })
        })
        // OwnedGadget.find({
        //         _id: {
        //             '$in': req.user.gadgetsOwned
        //         }
        //     })
        //     .populate('origin')
        //     .then((gadgets) => {
        //         console.log(gadgets)
        //         let zombieId = req.query.zombie_id;
        //         OwnedZombie.findOne({ _id: zombieId })
        //             .populate('origin')
        //             .populate('gadgets')
        //             .then((zombie) => {
        //                 let headwear = [];
        //                 let weapon = [];
        //                 let clothing = [];
        //                 for (var i = 0; i <= gadgets.length; i++) {
        //                     if (gadgets[i].origin.category === "Headwear") {
        //                         let newheadwear = gadgets[i].origin;
        //                         headwear.push(newheadwear);
        //                     } else if (gadgets[i].origin.category === "Weapon") {
        //                         let newweapon = gadgets[i].origin;
        //                         headwear.push(newweapon);
        //                     } else {
        //                         let newclothe = gadgets[i].origin;
        //                         clothing.push(newclothe);
        //                     }
        //                 }
        //                 console.log(clothing)
        //                 res.render('../views/profile/ownedZombieDetail.hbs', { zombie, headwear: headwear, weapon: weapon, clothing: clothing })
        //             })
        //     })
})




// OwnedGadget.find({
//         _id: {
//             '$in': req.user.gadgetsOwned
//         },
//         category: "Headwear",
//         attachedTo: null
//     })
//     .then(headwear => {
//         OwnedGadget.find({
//                 _id: {
//                     '$in': req.user.gadgetsOwned
//                 },
//                 category: "Weapon",
//                 attachedTo: null
//             })
//             .then(weapon => {
//                 OwnedGadget.find({
//                         _id: {
//                             '$in': req.user.gadgetsOwned
//                         },
//                         category: "Clothing",
//                         attachedTo: null
//                     })
//                     .then(clothing => {
//                         let zombieId = req.query.zombie_id;
//                         OwnedZombie.findOne({ _id: zombieId })
//                             .populate('origin')
//                             .populate('gadgets')
//                             .then((zombie) => {
//                                 console.log(clothing)
//                                 res.render('../views/profile/ownedZombieDetail.hbs', { zombie, headwear, weapon, clothing })
//                             })
//                     })
//             })

//     })


module.exports = router;