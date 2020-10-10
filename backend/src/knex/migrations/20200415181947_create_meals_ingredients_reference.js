const tablename = 'meals_ingredients'

exports.up = function(knex) {
  return knex.schema.table(tablename, function (table) {
    table.foreign('meals_id').references('meals.id')
    table.foreign('ingredients_id').references('ingredients.id')

  })
}

exports.down = function(knex) {
  return knex.schema.table(tablename, function(table) {
    table.dropForeign('meals_id')
    table.dropForeign('ingredients_id')
  })
}
