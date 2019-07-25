const express = require('express');
const router = express.Router();
const Zombie = require('../models/Zombie')

router.get('/zombiesForSale', (req, res, next) => {
    Zombie.find({})
        .then((zombies) => {
            res.render('zombiesForSale', { zombies });
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

module.exports = router;