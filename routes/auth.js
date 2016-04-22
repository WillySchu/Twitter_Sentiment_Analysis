'use strict';

const express = require('express');
const router = express.Router();
const unirest = require('unirest');
const passport = require('passport');

function createUser(data, callback) {
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) {
      callback(err);
    }

    bcrypt.hash(data.password, salt, (err, hash) => {
      if (err) {
        callback(err);
      }

      data.password_digest = hash;
      delete data.password;
      Users().insert(data, '*').then((data) => {
        callback(undefined, data);
      });
    });
  });
}

function authenticateUser(email, password, callback) {
  Users().where({email: email}).first().then(user => {
    if (!user) {
      return callback("Email and password don't match");
    }
    bcrypt.compare(password, user.password_digest, (err, isMatch) => {
      if (err || !isMatch) {
        return callback("Email and password don't match");
      } else {
        return callback(undefined, user);
      }
    });
  });
}

router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth/login' }),
  (req, res) => {
    res.redirect('/searches/new')
  }
);

router.get('/logout', (req, res) => {
  req.session = null;
  res.redirect('/');
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/signin', (req, res, next) => {
  Users.authenticateUser(req.body.email, req.body.password, (err, user) => {
    if (err) {
      res.render('login', {error: err});
    } else {
      req.session.user = user;
      res.redirect('/');
    }
  });
});

module.exports = router;
