var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

function Boards() {
  return knex('boards');
}

router.get('/', (req, res, next) => {
  Boards()
  .then(data => {
    res.render('boards/index', {data});
  });
});

router.get('/:id', (req, res, next) => {
  Boards()
  .where('boards.id', req.params.id)
  .join('boards_searches', 'boards_searches.board_id', '=', 'boards.id')
  .join('searches', 'searches.id', '=', 'boards_searches.search_id')
  .then(data => {
    res.render('boards/show', {data});
  });
});

module.exports = router;



// SELECT boards.name, searches.key1 FROM boards
// JOIN boards_searches ON boards_searches.board_id = boards.id
// JOIN searches ON searches.id = boards_searches.search_id
// WHERE boards.id = 1;
