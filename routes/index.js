const express = require('express');
const router = express.Router();
const sentiment = require('sentiment');
const Promise = require('bluebird');

const searchTwitter = require('../lib/search');

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/about', (req, res, next) => {
  res.render('about');
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

module.exports = router;
