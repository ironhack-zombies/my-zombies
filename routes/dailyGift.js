const express = require('express');
const router = express.Router();
const User = require('../models/user')

router.get('/dailyGift', (req, res, next) => {
    let endDate = new Date();
    User.findOne({ _id: req.user.id })
        .then((user) => {
            let timeStart = user.timeStart;
            if (endDate >= timeStart) {
                res.render("dailyGift", { user })
            } else {
                User.findOne({ _id: req.user.id })
                    .then(user => {
                        res.render('dailyGift', { user, notYet: true });
                    })
            }
        })
});

// router.post('/dailyGift', (req, res, next) => {
//     let brainOwned = req.user.brains
//     let newStart = new Date(new Date().setDate(new Date().getDate() + 1)).getTime()
//     let user = {
//         timeStart: newStart,
//     }
//     User.findByIdAndUpdate(req.user.id, user, { new: true })
//         .then(user => {})
// })

module.exports = router;