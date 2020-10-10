const tablename = 'orders_meals'

exports.up = function(knex) {
  return knex.schema.table(tablename, function (table) {
    table.foreign('orders_id').references('orders.id')
    table.foreign('meals_id').references('meals.id')

  })
}

exports.down = function(knex) {
  return knex.schema.table(tablename, function(table) {
    table.dropForeign('orders_id')
    table.dropForeign('meals_id')
  })
}
