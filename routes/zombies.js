const express = require('express');
const router = express.Router();
const Zombie = require('../models/Zombie')

router.get('/zombies-for-sale', (req, res, next) => {
    Zombie.find({})
        .then((zombies) => {
            res.render('zombies-for-sale', { zombies });
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

module.exports = router;