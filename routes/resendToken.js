const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const User = require('../models/user');
const Token = require('../models/tokenVeri');

router.post('/resend', function(req, res, next) {
    // req.assert('email', 'Email is not valid').isEmail();
    // req.assert('email', 'Email cannot be blank').notEmpty();
    // req.sanitize('email').normalizeEmail({ remove_dots: false });

    // Check for validation errors    
    var errors = req.validationErrors();
    if (errors) return res.status(400).send(errors);

    User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) return res.status(400).send({ msg: 'We were unable to find a user with that email.' });
        if (user.isVerified) return res.status(400).send({ msg: 'This account has already been verified. Please log in.' });

        // Create a verification token, save it, and send email
        var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

        // Save the token
        token.save(function(err) {
            if (err) { return res.status(500).send({ message: error.message }); }

            // Send the email
            var transporter = nodemailer.createTransport({
                service: 'Sendgrid',
                auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD }
            });
            var mailOptions = {
                from: 'no-reply@myzombies.me',
                to: user.email,
                subject: 'Account Verification Token',
                text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n'
            };
            transporter.sendMail(mailOptions, function(err) {
                if (err) { return res.status(500).send({ message: error.message }); }
                res.status(200).send('A verification email has been sent to ' + user.email + '.');
            });
        });

    })

})
module.exports = router;