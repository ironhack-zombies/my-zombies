const express = require('express');
const router = express.Router();
const Zombie = require('../models/zombie');
const OwnedZombie = require('../models/ownedZombie');
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const User = require('../models/user')

router.get('/zombiesForSale', (req, res, next) => {
    Zombie.find({})
        .then((zombie) => {
            console.log(zombie)
            res.render('zombiesForSale', { zombie });
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

router.post('/zombiesForSale', (req, res, next) => {
    let zombieType = req.body.zombieType;
    let str = zombieType.toLowerCase();
    let search = str.split('');
    let firstLetter = search[0]
    search.shift();
    search.unshift(firstLetter.toUpperCase())
    let searchStr = search.join('');
    Zombie.find({ type: searchStr })
        .then((zombie) => {
            res.render('zombiesForSale', { zombie });
        })
        .catch((err) => {
            res.send(err);
        })
})

router.get('/zombieDetail', (req, res, next) => {
    let zombieId = req.query.zombie_id;
    Zombie.findOne({ _id: zombieId })
        .then((zombie) => {
            res.render('../views/partials/zombieDetail', { zombie });
        })
        .catch((err) => {
            res.send(err);
        })
})

router.post('/zombieDetail', (req, res, next) => {
    if (req.user) {
        let zombieId = req.query.zombie_id;
        console.log(zombieId);
        Zombie.findOne({ _id: zombieId })
            .then((zombie) => {
                if (zombie.price > req.user.brains) {
                    res.render('../views/partials/zombieDetail', { zombie, notEnoughBrain: true });
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
                            User.findByIdAndUpdate(userId, userOwned, { new: true })
                                .then((user) => {
                                    User.populate(ownedzombie, 'zombiesOwned')
                                    res.render('../views/partials/zombieDetail', { zombie, buy: true });
                                })
                        })
                        .catch(err => {
                            res.status(500).send("ERROR");
                        })
                }
            })
    } else {
        res.redirect('/login')
    }


})

module.exports = router;