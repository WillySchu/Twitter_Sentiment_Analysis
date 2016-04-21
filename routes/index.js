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

router.post('/', (req, res, next) => {
  searchTwitter(req.body.test, (tweets) => {
    const pTweets = tweets.map(pSentiment);
    Promise.all(pTweets).then(data => {
      const scores = [];
      for (var i = 0; i < data.length; i++) {
        scores.push({text: tweets[i], score: data[i].score});
      }
      res.render('index', {scores})
    });
  });
});

function pSentiment(text) {
  const promise = new Promise((resolve, reject) => {
    sentiment(text, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
  return promise;
}

module.exports = router;
