
exports.up = (knex, Promise) => {
  return knex.schema.createTable('users', table => {
    table.increments();
    table.string('name');
    table.string('email');
    table.string('password');
    table.integer('githubid');
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('users');
};
