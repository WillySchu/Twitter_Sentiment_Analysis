'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../db/knex');

function Searches() {
  return knex('searches');
}

router.get('/', (req, res, next) => {
  console.log('wtf');
  Searches().where({id: req.query.searchId}).first().then(search => {
    res.send(search);
  });
});

module.exports = router;
