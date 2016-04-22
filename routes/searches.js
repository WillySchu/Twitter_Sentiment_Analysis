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

function Boards_searches() {
  return knex('boards_searches');
}

router.get('/new', (req, res, next) => {
  res.render('searches/new');
});

router.post('/', (req, res, next) => {
  if (req.body.boardId) {
    searchTwitter(req.body.keyword, 100, (tweets) => {
      sentiment.slow(tweets, (results) => {
        Searches().insert({key1: req.body.keyword, scores: JSON.stringify(results)}).returning('id').then(id => {
          Boards_searches().insert({board_id: parseInt(req.body.boardId), search_id: parseInt(id)}).returning('board_id').then(boardId => {
            res.redirect('searches/results?searchId=' + id[0] + '&boardId=' + boardId);
          });
        });
      });
    });
  } else {
    searchTwitter(req.body.keyword, 100, (tweets) => {
      sentiment.slow(tweets, (results) => {
        Searches().insert({key1: req.body.keyword, scores: JSON.stringify(results)}).returning('id').then(id => {
          res.redirect('searches/results?searchId=' + id[0]);
        });
      });
    });
  }
});

router.get('/results', (req, res, next) => {
  if (req.query.boardId) {
    Boards().first().where('id', '=', req.query.boardId).then(data => {
      res.render('searches/results', {data: data, searchId: req.query.searchId, boardId: req.query.boardId});
    });
  } else {
    Searches()
    .first()
    .where({'id': req.query.searchId})
    .then(results => {
      Boards()
      .then(boards => {
        res.render('searches/results', {results, boards});
      });
    });
  }
});

// router.post('/results', (req, res, next) => {
//   Boards_searches().insert({board_id: parseInt(req.body.boardId), search_id: parseInt(id)}).returning('board_id').then(boardId => {
//     res.redirect('searches/results?searchId=' + id[0] + '&boardId=' + boardId);
//   });
// });

router.get('/new/:id', (req, res, next) => {
  Boards().first()
  .where({id: req.params.id})
  .then(data => {
    res.render('searches/new', {data});
  });
});

module.exports = router;
