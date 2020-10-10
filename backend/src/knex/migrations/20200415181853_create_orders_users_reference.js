const tablename = 'orders_users'

exports.up = function(knex) {
  return knex.schema.table(tablename, function (table) {
    table.foreign('orders_id').references('orders.id')
    table.foreign('users_id').references('users.id')
  })
}

exports.down = function(knex) {
  return knex.schema.table(tablename, function(table) {
    table.dropForeign('orders_id')
    table.dropForeign('users_id')
  })
}
