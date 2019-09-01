exports.up = function(knex) {
  return knex.schema.table('meta', function(table) {
    table.string('caller')
    table.string('collector')
    table.string('collecttime')
    table.string('datestring')
    table.dropColumn('key')
    table.dropColumn('value')
  })
}

exports.down = function(knex) {
  return knex.schema.table('meta', function(table) {
    table.dropColumn('caller')
    table.dropColumn('collector')
    table.dropColumn('collecttime')
    table.dropColumn('datestring')
    table.string('key')
    table.string('value')
  })
}
