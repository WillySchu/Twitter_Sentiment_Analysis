
exports.up = (knex, Promise) => {
  return knex.schema.createTable('boards', table => {
    table.increments();
    table.integer('user_id');
    table.string('name');
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('boards')
};
