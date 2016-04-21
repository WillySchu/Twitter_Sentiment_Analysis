'use strict';

const express = require('express');
const router = express.Router();
const unirest = require('unirest');
const passport = require('passport');

router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth/login' }),
  (req, res) => {
    res.redirect('searches/new')
  }
);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/')
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

module.exports = router;
