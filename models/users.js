'use strict';

const knex = require('../db/knex');
const Promise = require('bluebird');

function Users() {
  return knex('users')
};

Users.findOrCreate = (githubid, callback) => {
  return Users().first().where(githubid).then((user) => {
    if (!user) {
      Users().insert(githubid, '*').then((poser) => {
        return callback(null, poser)
      });
    } else {
      return callback(null, user)
    }
  });
}

module.exports = Users;
