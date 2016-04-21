const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const Promise = require('bluebird');

const sentiment = require('../lib/sent');
const searchTwitter = require('../lib/search');


function Searches() {
  return knex('searches');
}

function Boards() {
  return knex('boards');
}

router.get('/new', (req, res, next) => {
  res.render('searches/new');
});

router.post('/', (req, res, next) => {
  searchTwitter(req.body.keyword, 100, (tweets) => {
    sentiment.slow(tweets, (results) => {
      Searches().insert({key1: req.body.keyword, scores: JSON.stringify(results)}).returning('id').then(id => {
        console.log(id);
        res.redirect('/searches/results?searchId=' + id[0]);
      });
    });
  });
});

router.get('/results', (req, res, next) => {
  res.render('searches/results')
})

router.get('/new/:id', (req, res, next) => {
  Boards().first()
  .where({id: req.params.id})
  .then(data => {
    res.render('searches/new', {data});
  });
});

router.post('/:id', (req, res, next) => {
  searchTwitter(req.body.keyword, 10, (tweets) => {
    sentiment.slow(tweets, (results) => {
      res.render('searches/results', {results});
    });
  });
});

module.exports = router;
