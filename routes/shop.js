const express = require('express');
const router = express.Router();
const Zombie = require('../models/zombie');
const Gadget = require('../models/gadget');
const OwnedZombie = require('../models/ownedZombie');
const mongoose = require('mongoose');
const User = require('../models/user')

router.get('/zombies', (req, res, next) => {
    if (req.query.search && req.query.search !=="") {
        Zombie.find({
                type: {
                    $regex: ".*" + req.query.search + ".*",
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

router.get('/gadgets', (req, res, next) => {
    Gadget.find({})
        .then((gadgets) => {
            res.render('shop/gadgets', {
                gadgets
            });
        })
        .catch((err) => {
            next(err);
        })
})

router.get('/food', (req, res, next) => {
    res.render('shop/food');
})

router.get('/zombieDetail', (req, res, next) => {
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

router.post('/zombieDetail', (req, res, next) => {
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

module.exports = router;