const express = require('express');
const router = express.Router();
const User = require('../models/user')
const secured = require('../lib/middleware/secured')

router.get('/dailyGift', secured(), (req, res, next) => {
    let endDate = new Date().getTime();
    User.findOne({
            _id: req.user.id
        })
        .then((user) => {
            let timeStart = user.timeStart;
            if (endDate >= timeStart) {
                res.render("dailyGift", {
                    user,
                    notYet: false
                })
            } else {
                User.findOne({
                        _id: req.user.id
                    })
                    .then(user => {
                        res.render('dailyGift', {
                            user,
                            notYet: true
                        });
                    })
            }
        })
});

router.post('/dailyGift', secured(), (req, res, next) => {
    let brainsInBox;
    let totalBrains;
    User.findById(req.user._id)
        .then(user => {
            if (!user) {
                res.status(500).send(`{message: 'User not found'}`)
                return;
            }
            let brainOwned = req.user.brains
            let timeWait = Math.random() * 0.5 * 3600000;
            let newStart = new Date(new Date().setTime(new Date().getTime() + 1.5*60*60*1000 + timeWait)).getTime();
            brainsInBox = Math.floor(Math.random() * 20)
            totalBrains = brainOwned + brainsInBox;

            return user.updateOne({
                brains: totalBrains,
                timeStart: newStart,
            })
        })
        .then(docs => {
            if (docs.nModified === 1) {
                res.status(200).send({
                    boxContent: {
                        brains: brainsInBox
                    },
                    user: {
                        brains: totalBrains
                    }
                })
            } else {
                throw new Error("Failed to update user with new brains")
            }
        })
        .catch(error => {
            res.status(500).send({
                error: {
                    message: error.message
                }
            })
        })
});
module.exports = router;