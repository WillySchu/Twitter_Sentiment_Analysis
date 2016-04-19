
exports.up = function(knex, Promise) {
  return knex.schema.createTable('searches', table => {
    table.increments();
    table.string('key1');
    table.json('scores');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('searches');
};
