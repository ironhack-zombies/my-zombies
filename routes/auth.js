var express = require('express');
var router = express.Router();
var passport = require('passport');
var dotenv = require('dotenv');

dotenv.config();

router.get('/login', function (req, res) {
  res.render('home', {message: req.flash('message')});
});

router.post('/login', function (req, res, next) {
  console.log("login")
  console.log(req.body)
  next()
}, passport.authenticate('login', {
  successRedirect: '/',
  failureRedirect: '/',
  failureFlash: true
}));

router.get('/signup', function (req, res) {
  res.render('home', {message: req.flash('message')});
});

/* Handle Registration POST */
router.post('/signup', function (req, res, next) {
  console.log("signup")
  console.log(req.body)
  next()
}, passport.authenticate('signup', {
  successRedirect: '/',
  failureRedirect: '/',
  failureFlash: true
}));

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;