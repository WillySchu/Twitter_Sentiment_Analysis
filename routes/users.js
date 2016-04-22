const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const Promise = require('bluebird');

function Users() {
  return knex('users');
}

function Boards() {
  return knex('boards');
}

function Searches() {
  return knex('searches');
}

router.get('/', (req, res, next) => {
  Users()
  .then(data => {
    res.render('users/index', {data});
  });
});

router.get('/:id', (req, res, next) => {
  Users()
  .where({'users.id': req.params.id})
  .join('boards', 'boards.user_id', '=', 'users.id')
  .select('users.name as username', 'users.id as userid', 'boards.name as boardname', 'boards.id as boardid')
  .then(boards => {
    Searches()
    .join('boards_searches', 'boards_searches.search_id', '=', 'searches.id')
    .select('searches.key1', 'boards_searches.search_id', 'boards_searches.board_id')
    .then(searches => {
      console.log(boards);
      console.log(searches);
      res.render('users/show', {boards, searches});
    });
  });
});

module.exports = router;
