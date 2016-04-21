var express = require('express');
var router = express.Router();
var knex = require('../db/knex');


router.get('/', (req, res, next) => {
  res.render('boards/index');
});

router.get('/new', (req, res, next) => {
  res.render('boards/new');
});

router.get('/shared', (req, res, next) => {
  res.render('boards/shared');
});

module.exports = router;
