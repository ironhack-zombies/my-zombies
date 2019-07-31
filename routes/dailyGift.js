const express = require('express');
const router = express.Router();
const User = require('../models/user')
const secured = require('../lib/middleware/secured')

router.get('/dailyGift', secured(), (req, res, next) => {
    let endDate = new Date().getTime();
    User.findOne({ _id: req.user.id })
        .then((user) => {
            let timeStart = user.timeStart;
            if (endDate >= timeStart) {
                res.render("dailyGift", { user, notYet: false })
            } else {
                User.findOne({ _id: req.user.id })
                    .then(user => {
                        res.render('dailyGift', { user, notYet: true });
                    })
            }
        })
});

router.post('/dailyGift', secured(), (req, res, next) => {
    res.redirect('/dailyGift');
})

router.post('/dailyGift/:id', secured(), (req, res, next) => {
    User.findById(req.params.id)
        .then(user => {
            if (!user) {
                res.status(500).send(`{message: 'User not found'}`)
                return;
            }
            debugger
            let brainOwned = req.user.brains
            let timeWait = Math.random() * 1.5 * 3600000;
            let newStart = new Date(new Date().setTime(new Date().getTime() + 5400000 + timeWait)).getTime();
            let brainsInBox = Math.floor(Math.random() * 20)
            let totalBrains = brainOwned + brainsInBox;

            user.updateOne({
                    brains: totalBrains,
                    timeStart: newStart,
                })
                .then(
                    res.status(200).send({ boxContent: { brains: brainsInBox } }))
                .catch(error => {
                    res.status(500).send({ boxContent: { brains: 0 } })
                })
        })
});
module.exports = router;