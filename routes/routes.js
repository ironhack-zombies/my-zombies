const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.use(require('../lib/middleware/userInViews')());

// Handle auth failure error messages
router.use(function(req, res, next) {
    if (req && req.query && req.query.error) {
        req.flash('error', req.query.error);
    }
    if (req && req.query && req.query.error_description) {
        req.flash('error_description', req.query.error_description);
    }
    next();
});

// import all other routes from subfiles
router.use("/", require("./auth"));
router.use(require("./index"));
router.use(require("./help"));
router.use(require("./about"));
router.use(require("./village"));
router.use("/shop", require("./shop"));
router.use(require("./users"));
router.use(require("./dailyGift"));
router.use(require("./ownedZombieDetail"));
router.use(require("./equipGadget"));
router.use(require("./deleteGadget"));


// catch 404 and render a not-found.hbs template
router.use((req, res, next) => {
    res.status(404);
    res.render('404');
});

// Development error handler
// Will print stacktrace
if (router.get('env') === 'development') {
    router.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// Production error handler
// No stacktraces leaked to user
router.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = router;