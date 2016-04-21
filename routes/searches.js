const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const sentiment = require('sentiment');
const Promise = require('bluebird');

const searchTwitter = require('../lib/search');


function Searches() {
  return knex('searches');
}

function Boards() {
  return knex('boards');
}

function pSentiment(text) {
  const promise = new Promise((resolve, reject) => {
    sentiment(text, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
  return promise;
}

router.get('/new', (req, res, next) => {
  res.render('searches/new');
});

router.post('/', (req, res, next) => {
  // // this route will just produce a result,
  // // but will not insert anything into the tables
  // searchTwitter(req.body.keyword, (tweets) => {
  //   Promise.all(tweets).then(data => {
  //     const scores = [];
  //     for (var i = 0; i < data.length; i++) {
  //       scores.push(data[i].score);
  //     }
  //     console.log(scores);
      res.render('results', {scores: '(this is the scores object)'});
  //   });
  // });
});

router.get('/new/:id', (req, res, next) => {
  Boards().first()
  .where({id: req.params.id})
  .then(data => {
    res.render('searches/new', {data});
  });
});

router.post('/:id', (req, res, next) => {
  // // this route will produce the result page AND insert into the tables
  // searchTwitter(req.body.keyword, (tweets) => {
  //   Promise.all([tweets]).then(data => {
  //     const scores = [];
  //     for (var i = 0; i < data.length; i++) {
  //       scores.push(data[i].score);
  //     }
  //     console.log(scores);
      res.render('results', {scores: '(this is the scores object)'});
  //   });
  // });
});

module.exports = router;
