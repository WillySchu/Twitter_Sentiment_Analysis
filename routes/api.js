'use strict';

const express = require('express');
const router = express.Router();

function Searches() {
  return knex('searches');
}

router.get('/', (req, res, next) => {
  Searches().where({id: req.query.searchId}).first().then(search => {
    res.send(search);
  });
});

module.exports = router;
