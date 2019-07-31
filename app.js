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
const bodyParser = require('body-parser')

hbs.registerHelper('ifIn', function(elem, list, options) {
    if (list.indexOf(elem) > -1) {
        return options.fn(this);
    }
    return options.inverse(this);
});

hbs.registerHelper('ifvalue', function (conditional, options) {
    if (options.hash.value && conditional && options.hash.value.toString() === conditional.toString()) {
      return options.fn(this)
    } else {
      return options.inverse(this);
    }
  });

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
        ttl: 2 * 60 * 60
    }),
    resave: false,
    saveUninitialized: true,
    proxy: app.get('env') === 'production',
    cookie: {
        secure: app.get('env') === 'production'
    }
}))

if (app.get('env') === 'production') {
    // enforce https and deny put requests over http
    app.use(function(req, res, next) {
        let isHttps = req.secure || (req.headers["x-forwarded-proto"] || '').substring(0, 5) === 'https';
        if (isHttps) next();
        else {
            if (req.method === "GET" || req.method === "HEAD") {
                // enforce heroku subdomain for now
                let host = "myzombies.herokuapp.com";
                res.redirect(301, "https://" + host + req.originalUrl);
            } else {
                res.status(403).send("Data can only be submitted to this server via https")
            }
        }
    });
}

app.use(passport.initialize());
app.use(passport.session());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));
hbs.registerPartials(path.join(__dirname, 'views', 'profile'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

let giftCheck = function(req, res, next) {
    if (req.user) {
        let timeStart = req.user.timeStart;
        let timeNow = new Date().getTime();
        console.log(timeNow);
        if (timeNow >= timeStart) {
            res.locals = { notYet: false };
            next();
        } else {
            res.locals = { notYet: true };
            next();
        }
    } else {
        let timeNow = new Date().getTime();
        console.log(timeNow);
        res.locals = { notYet: true };
        next();
    }
}

app.use(giftCheck);

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