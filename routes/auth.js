const express = require('express');
const router = express.Router();
const passport = require('passport');
const dotenv = require('dotenv');
const bodyParser = require('body-parser')

dotenv.config();

router.get('/login', function(req, res) {
    res.render('../views/partials/loginForm', { message: req.flash('message') });
});

router.post('/login', passport.authenticate('login', {
    successRedirect: ('/user'),
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/signup', function(req, res) {
    res.render('../views/partials/registerForm', { message: req.flash('message') });
});

/* Handle Registration POST */
router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;