exports.up = function(knex) {
  return knex.schema.createTable('meta', function(table) {
    table.increments()
    table.string('key')
    table.string('value')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('meta')
}
