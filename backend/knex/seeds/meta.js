exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('meta')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('meta').insert([{id: 1, caller: '', collector: '', collecttime: '', datestring: ''}])
    })
}
