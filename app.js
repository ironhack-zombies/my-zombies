require('dotenv').config();

const hbs = require('hbs');
const mongoose = require('mongoose');
const express = require('express');
const http = require('http');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');

var passport = require('passport');
var Auth0Strategy = require('passport-auth0');

// Connection to the database "recipeApp"
mongoose.connect(process.env.MONGODB_URI, {
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true
    })
    .then(() => {
        console.log('Connected to Mongo!');
    }).catch(err => {
        console.error('Error connecting to mongo', err);
    });

const app = express();

app.use(session({
    secret: process.env.SECRET,
    store: new MongoStore({
        url: process.env.MONGODB_URI,
        ttl: 24 * 60 * 60
    }),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: app.get('env') === 'production' }
}))

var strategy = new Auth0Strategy({
        domain: process.env.AUTH0_DOMAIN,
        clientID: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        callbackURL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
    },
    function(accessToken, refreshToken, extraParams, profile, done) {
        // accessToken is the token to call Auth0 API (not needed in the most cases)
        // extraParams.id_token has the JSON Web Token
        // profile has all the information from the user
        return done(null, profile);
    }
);

passport.use(strategy);

// You can use this section to keep a smaller payload
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

// app.use(require("./routes/auth"));
app.use(require("./routes/routes"))

let server = http.createServer(app);

server.on('error', error => {
    if (error.syscall !== 'listen') {
        throw error
    }

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(`Port ${process.env.PORT} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`Port ${process.env.PORT} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
});

server.listen(process.env.PORT, () => {
    console.log(`Listening on http://localhost:${process.env.PORT}`);
});