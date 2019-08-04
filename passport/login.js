var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcryptjs');

module.exports = function(passport) {
    passport.use('login', new LocalStrategy({
            passReqToCallback: true
        },
        function(req, username, password, done) {
            User.findOne({
                    'username': username
                },
                function(err, user) {
                    if (err)
                        return done(err);
                    if (!user) {
                        console.log('User Not Found with username ' + username);
                        return done(null, false,
                            req.flash('message', 'Invalid username or password'));
                    }
                    if (!isValidPassword(user, password)) {
                        console.log('Invalid Password');
                        return done(null, false,
                            req.flash('message', 'Invalid username or password'));
                    }
                    // new changes : adding email verification
                    if (!user.isVerified) {
                        return done(null, false,
                                req.flash('message', 'Your account has not been verified'))
                            // res.status(401).send({ type: 'not-verified', msg: 'Your account has not been verified.' });
                    }
                    res.send({ token: generateToken(user), user: user.toJSON() });
                    // new changes
                    return done(null, user);
                }
            )
        }
    ));

    var isValidPassword = function(user, password) {
        return bCrypt.compareSync(password, user.password);
    }
}