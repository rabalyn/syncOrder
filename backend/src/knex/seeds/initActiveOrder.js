exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('config')
    .del()
    .then(function() {
      return knex('orders')
        .del()
        .then(function() {
          // Inserts seed entries
          return knex('orders').insert({id: 1, open: true})
            // eslint-disable-next-line
            .then(() => knex('config').insert({active_order: 1}))
        })
    })
}
