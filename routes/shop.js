const express = require('express');
const router = express.Router();
const Zombie = require('../models/zombie');
const Gadget = require('../models/gadget');
const OwnedZombie = require('../models/ownedZombie');
const mongoose = require('mongoose');
const User = require('../models/user');
const secured = require('../lib/middleware/secured')

router.get('/zombies', secured(), (req, res, next) => {
    if (req.query.search && req.query.search !== "") {
        Zombie.find({
                type: {
                    $regex: ".*" + req.query.search + ".*",
                    // case insensitive
                    $options: 'i'
                }
            })
            .then(zombies => {
                res.render('shop/zombies', {
                    zombies: zombies,
                    search: req.query.search
                });
            })
            .catch((err) => {
                next(err);
            })
    } else {
        Zombie.find({})
            .then(zombies => {
                res.render('shop/zombies', {
                    zombies
                });
            })
            .catch((err) => {
                next(err);
            })
    }
})

router.get('/gadgets', secured(), (req, res, next) => {
    Gadget.find({
            tier: { $in: ['Basic', 'Good'] }
        })
        .then((gadgets) => {
            console.log(gadgets)
            res.render('shop/gadgets', {
                gadgets
            });
        })
        .catch((err) => {
            next(err);
        })
})


router.get('/food', secured(), (req, res, next) => {
    res.render('shop/food');
})

router.get('/zombieDetail', secured(), (req, res, next) => {
    debugger
    let zombieId = req.query.zombie_id;
    Zombie.findOne({
            _id: zombieId
        })
        .then((zombie) => {
            res.render('../views/partials/zombieDetail', {
                zombie
            });
        })
        .catch((err) => {
            res.send(err);
        })
})

router.post('/zombieDetail', secured(), (req, res, next) => {
    if (req.user) {
        let zombieId = req.query.zombie_id;
        console.log(zombieId);
        Zombie.findOne({
                _id: zombieId
            })
            .then((zombie) => {
                if (zombie.price > req.user.brains) {
                    res.render('../views/partials/zombieDetail', {
                        zombie,
                        notEnoughBrain: true
                    });
                } else {
                    let id = zombie._id
                    var newOwnedZombie = new OwnedZombie({
                        origin: mongoose.Types.ObjectId(id),
                        nickname: req.body.nickname.trim()
                    });
                    newOwnedZombie.save(
                            OwnedZombie.populate(newOwnedZombie, 'origin'))
                        .then((ownedzombie) => {
                            let userId = req.user._id;
                            let ownedZombieId = mongoose.Types.ObjectId(ownedzombie._id);
                            let brainsLeft = req.user.brains - zombie.price;
                            let zombArr = req.user.zombiesOwned;
                            zombArr.push(ownedZombieId);
                            let userOwned = {
                                zombiesOwned: zombArr,
                                brains: brainsLeft
                            }
                            User.findByIdAndUpdate(userId, userOwned, {
                                    new: true
                                })
                                .then((user) => {
                                    User.populate(ownedzombie, 'zombiesOwned')
                                    res.render('../views/partials/zombieDetail', {
                                        zombie,
                                        user,
                                        buy: true
                                    });
                                })
                        })
                        .catch(err => {
                            res.status(500).send("ERROR (BRAAIIIIINS)");
                        })
                }
            })
    } else {
        res.redirect('/login')
    }


})

router.post('/gadgets', secured(), (req, res, next) => {
    let gadgetId = req.query.gadget_id;
    Gadget.findOne({ _id: gadgetId })
        .then((gadget) => {
            if (gadget.price > req.user.brains) {
                Gadget.find()
                    .then(gadgets => {
                        res.render('../views/shop/gadgets', {
                            gadgets,
                            notEnoughBrain: true
                        });
                    })
            } else {
                let userId = req.user._id;
                let ownedGadgetId = mongoose.Types.ObjectId(gadget._id);
                let brainsLeft = req.user.brains - gadget.price;
                let gadgetArr = req.user.gadgetsOwned;
                gadgetArr.push(ownedGadgetId);
                let userOwned = {
                    gadgetsOwned: gadgetArr,
                    brains: brainsLeft
                }
                User.findByIdAndUpdate(userId, userOwned, {
                        new: true
                    })
                    .then((user) => {
                        debugger
                        User.populate(gadget, 'gadgetsOwned')
                        Gadget.find()
                            .then(gadgets => {
                                res.render('../views/shop/gadgets', {
                                    gadgets,
                                    buy: true
                                });
                            })

                    })
            }

        })
})
module.exports = router;