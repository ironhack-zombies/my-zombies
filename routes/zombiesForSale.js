const express = require('express');
const router = express.Router();
const Zombie = require('../models/zombie');

router.get('/zombiesForSale', (req, res, next) => {
    Zombie.find({})
        .then((zombie) => {
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
            res.render('../views/partials/zombieDetail.hbs', { zombie });
        })
        .catch((err) => {
            res.send(err);
        })
})

module.exports = router;