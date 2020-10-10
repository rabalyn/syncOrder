const debug = require('debug')
const order = require('../order')

const log = debug('panf-api:lib:socket:order:info')

module.exports = function(io, socket) {
  socket.on('clearList', () => {
    log('clearList now')
    order.deleteActiveOrder()
  })
}
