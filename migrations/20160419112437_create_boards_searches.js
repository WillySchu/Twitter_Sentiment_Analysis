
exports.up = (knex, Promise) => {
  return knex.schema.createTable('boards_searches', table => {
    table.increments();
    table.integer('board_id');
    table.integer('search_id');
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('boards_searches');
};
