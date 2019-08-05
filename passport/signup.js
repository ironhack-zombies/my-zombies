var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Token = require('../models/tokenVeri');

module.exports = function(passport) {

    passport.use('signup', new LocalStrategy({
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            debugger
            findOrCreateUser = function() {
                // find a user in Mongo with provided username
                User.findOne({
                    'username': username
                }, function(err, user) {
                    // In case of any error, return using the done method
                    if (err) {
                        console.log('Error in SignUp: ' + err);
                        return done(err);
                    }
                    // already exists
                    if (user) {
                        console.log('User already exists with username: ' + username);
                        return done(null, false, req.flash('message', 'User Already Exists'));
                    } else {
                        // set the user's local credentials
                        let newUser = {}
                        newUser.username = username;
                        newUser.password = createHash(password);
                        newUser.email = req.body.email;
                        newUser.timeStart = new Date().getTime();
                        // save the user
                        new User(newUser).save()
                            .then(user => {
                                // function(err) {
                                //     if (err) { return res.status(500).send({ message: error.message }); }

                                // Create a verification token for this user
                                var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

                                // Save the verification token
                                token.save()
                                    .then(token => {
                                        // Send the email
                                        var transporter = nodemailer.createTransport({
                                            service: 'Sendgrid',
                                            auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD }
                                        });
                                        var mailOptions = {
                                            from: 'no-reply@myzombies.com',
                                            to: user.email,
                                            subject: 'Account Verification Token',
                                            text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n'
                                        };
                                        transporter.sendMail(mailOptions, function(err) {
                                            if (err) { return res.status(500).send({ message: error.message }); }
                                            res.status(200).send('A verification email has been sent to ' + user.email + '.');
                                        });
                                    })
                                    // }
                            })
                            // new changes

                        // new changes

                        // Nikl's part for logging in after sign up 
                        // .then(user => {
                        //     console.log('User Registration succesful');
                        //     // login
                        //     req.login(user, function(err) {
                        //         if (err) {
                        //             console.log(err);
                        //         }
                        //         return done(null, user);
                        //     });
                        // })
                        // .catch(error => {
                        //     console.error(error)
                        //     return done(err);
                        // });
                    }
                });
            };
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        }));

    // Generates hash using bCrypt
    var createHash = function(password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(11), null);
    }

}