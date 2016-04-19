const express = require('express');
const router = express.Router();
const sentiment = require('sentiment');
const searchTwitter = require('../lib/search');

router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/', (req, res, next) => {
  searchTwitter(req.body.test, () => {

  });
  sentiment(req.body.test, (err, result) => {
    res.render('index', {test: result.score})
  });
});

module.exports = router;
