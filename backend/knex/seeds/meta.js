exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('meta')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('meta').insert([
        {id: 1, key: 'dateString', value: ''},
        {id: 2, key: 'collectTime', value: ''},
        {id: 3, key: 'caller', value: ''},
        {id: 4, key: 'collector', value: ''}
      ])
    })
}
