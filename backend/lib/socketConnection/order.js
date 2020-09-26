import debug from 'debug'

import order from '../order'

const log = debug('panf:lib:socket:order:info')

module.exports = function(io, socket) {
  socket.on('clearList', () => {
    log('clearList now')
    order.deleteActiveOrder()
  })
}
