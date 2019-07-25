var express = require('express');
var router = express.Router();
var passport = require('passport');
var dotenv = require('dotenv');

dotenv.config();

router.get('/login', function(req, res) {
    res.render('../views/partials/loginForm', { message: req.flash('message') });
});

router.post('/login', passport.authenticate('login', {
    successRedirect: '/profile',
    failureRedirect: '/',
    failureFlash: true
}));

router.get('/signup', function(req, res) {
    res.render('../views/partials/registerForm', { message: req.flash('message') });
});

/* Handle Registration POST */
router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/',
    failureRedirect: '/',
    failureFlash: true
}));

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;