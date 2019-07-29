const express = require('express');
const router = express.Router();
const User = require('../models/user')

router.get('/dailyGift', (req, res, next) => {
    debugger
    let endDate = new Date();
    console.log(endDate);
    User.findOne({ _id: req.user.id })
        .then((user) => {
            let timeStart = user.timeStart;
            if (endDate >= timeStart) {
                console.log(timeStart);
                let newStart = new Date(new Date().setDate(new Date().getDate() + 1))
                let time = (newStart.getTime() - endDate.getTime());
                hourLeft = Math.floor((time / 3600000) % 24);
                minLeft = Math.floor((time / 60000) % 60);
                secLeft = Math.floor((time / 1000) % 60);
                debugger
                let user = {
                    timeStart: newStart,
                    hourLeft: hourLeft,
                    minLeft: minLeft,
                    secLeft: secLeft
                }
                User.findByIdAndUpdate(req.user.id, user, { new: true })
                    .then(user => {
                        res.render("dailyGift", { notYet: false, user })
                    })

                res.render("dailyGift");
            } else {
                let time = (timeStart.getTime() - endDate.getTime());
                hourLeft = Math.floor((time / 3600000) % 24);
                minLeft = Math.floor((time / 60000) % 60);
                secLeft = Math.floor((time / 1000) % 60);

                let user = {
                    hourLeft: hourLeft,
                    minLeft: minLeft,
                    secLeft: secLeft
                }
                User.findByIdAndUpdate(req.user.id, user, { new: true })
                    .then(user => {
                        res.render("dailyGift", { notYet: true, user })

                    })
            }
        })
});

module.exports = router;