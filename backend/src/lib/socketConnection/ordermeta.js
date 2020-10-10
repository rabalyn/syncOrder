const debug = require('debug')
const order = require('../order')

const log = debug('panf-api:lib:socket:meta:info')

module.exports = function(io, socket) {
  socket.on('loadMeta', async () => {
    log('loadMeta')
    const activeOrderId =  await order.readActiveOrderId()
    log('activeOrderId: %s', activeOrderId)
    const activeOrder = await order.readOrder(activeOrderId)
    socket.emit('sendOrdermeta', activeOrder)
  })

  socket.on('syncDate', (dateString) => {
    log('syncDate')
    if (dateString) {
      socket.broadcast.emit('pushDate', dateString)
      order.updateActiveOrder({datestring: dateString})
    }
  })

  socket.on('syncCollectTime', (collectTime) => {
    log('syncCollectTime')
    if (collectTime) {
      socket.broadcast.emit('pushCollectTime', collectTime)
      order.updateActiveOrder({collecttime: collectTime})
    }
  })

  socket.on('syncCaller', (caller) => {
    log('syncCaller')
    if (caller) {
      socket.broadcast.emit('pushCaller', caller)
      order.updateActiveOrder({caller: caller})
    }
  })

  socket.on('syncCollector', (collector) => {
    log('syncCollector')
    if (collector) {
      socket.broadcast.emit('pushCollector', collector)
      order.updateActiveOrder({collector: collector})
    }
  })
}
