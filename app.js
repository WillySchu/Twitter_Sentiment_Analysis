'use strict';

const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const GithubStrategy = require('passport-github2').Strategy;
const passport = require('passport');

const routes = require('./routes/index');
const users = require('./routes/users');
const auth = require('./routes/auth');
const User = require('./models/users.js');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

require('dotenv').load();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_KEY]
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GithubStrategy ({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: 'http://127.0.0.1:3000/auth/github/callback'
},
  (accessToken, refreshToken, profile, done) => {
    User.findOrCreate({ githubid: profile.id }, (err, user) => {
      console.log(user);
      return done(err, user);
  });
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use((req, res, next) => {
  console.log(req.user);
  console.log(req.isAuthenticated());
  res.locals.user = req.user;
  next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/auth', auth);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
