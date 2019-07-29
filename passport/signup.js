var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcryptjs');

module.exports = function(passport) {

    passport.use('signup', new LocalStrategy({
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {

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
                        newUser.timeStart = new Date(new Date().setDate(new Date().getDate() + 1));
                        // save the user
                        new User(newUser).save()
                            .then(user => {
                                console.log('User Registration succesful');
                                // login
                                req.login(user, function(err) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    return done(null, user);
                                });
                            })
                            .catch(error => {
                                console.error(error)
                                return done(err);
                            });
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