const tablename = 'orders_ingredients'

exports.up = function(knex) {
  return knex.schema.table(tablename, function (table) {
    table.foreign('orders_id').references('orders.id')
    table.foreign('ingredients_id').references('ingredients.id')

  })
}

exports.down = function(knex) {
  return knex.schema.table(tablename, function(table) {
    table.dropForeign('orders_id')
    table.dropForeign('ingredients_id')
  })
}
