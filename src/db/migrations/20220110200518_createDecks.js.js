
exports.up = function(knex) {
  return knex.schema.createTable("decks", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.text("description");
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable("decks");
};
