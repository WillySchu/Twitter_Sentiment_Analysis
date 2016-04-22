var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

function Boards() {
  return knex('boards');
}

function Searches() {
  return knex('searches');
}

function Users() {
  return knex('users');
}

router.get('/new', (req, res, next) => {
  res.render('boards/new');
});

router.get('/', (req, res, next) => {
  Users()
  .join('boards', 'boards.user_id', '=', 'users.id')
  .select('users.name as username', 'users.id as userid', 'boards.name as boardname', 'boards.id as boardId')
  .then(boards => {
    Searches()
    .join('boards_searches', 'boards_searches.search_id', '=', 'searches.id')
    .select('searches.key1', 'boards_searches.search_id', 'boards_searches.board_id')
    .then(searches => {
      res.render('boards/index', {boards, searches});
      console.log(searches);
    });
  });
});


module.exports = router;
