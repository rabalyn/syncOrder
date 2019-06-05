import Moment from 'moment'
import debug from 'debug'

const loginfo = debug('panf:socketHobbit:info')
const logdebug = debug('panf:socketHobbit:debug')
loginfo.log = console.log.bind(console)
logdebug.log = console.log.bind(console)

const serializeJson = require('../serializeJson')
let serializer = null

module.exports.panfIO = function (http, config) {
  serializer = new serializeJson.Serialize(config)

  const io = require('socket.io')(http)
  io.on('connection', (socket) => {
    loginfo('a user connected')

    socket.on('disconnect', () => {
      loginfo('user disconnected')
    })

    socket.emit('initOrders', global.panf.orders)
    socket.emit('initPaied', global.panf.paied)

    /*
        META DATA
    */
    socket.emit('initMeta', global.panf.meta)

    socket.on('loadMeta', () => {
      logdebug('loadMeta - sendMeta: %o', global.panf.meta)
      socket.emit('sendMeta', global.panf.meta)
    })

    socket.on('syncDate', (dateString) => {
      logdebug('syncDate - pushDate: %s', dateString)
      global.panf.meta.dateString = dateString
      socket.broadcast.emit('pushDate', dateString)
    })

    socket.on('syncCollectTime', (collectTime) => {
      logdebug('syncCollectTime - pushCollectTime: %s', collectTime)
      global.panf.meta.collectTime = collectTime
      socket.broadcast.emit('pushCollectTime', collectTime)
    })

    socket.on('syncCaller', (caller) => {
      logdebug('syncCaller - pushCaller: %s', caller)
      global.panf.meta.caller = caller
      socket.broadcast.emit('pushCaller', caller)
    })

    socket.on('syncCollector', (collector) => {
      logdebug('syncCollector - pushCollector: %s', collector)
      global.panf.meta.collector = collector
      socket.broadcast.emit('pushCollector', collector)
    })
    /*
        // META DATA
    */

    socket.on('syncPrepaid', (tableList) => {
      global.panf.paied = tableList.map(x => x.prepaid)
      io.emit('updatePrepaid', global.panf.paied)
    })

    socket.on('clearList', () => {
      const format = 'HH:mm'
      const before = new Moment('10:00', format)
      const after = new Moment('13:30', format)
      const now = new Moment()
      const listClearable = !now.isBetween(before, after)
      logdebug('clearList @%s', now.format(format))
      if (listClearable) {
        logdebug('resetting state...')
        global.panf.tableId = 1
        global.panf.orders = []
        global.panf.meta = {}
        global.panf.paied = []
        serializer.sync(global.panf.tableId, global.panf.orders, global.panf.meta, global.panf.paied)
        io.sockets.emit('reload', { receivers: 'everyone' })
      } else {
        logdebug('we are in order process...')
        socket.emit('trollProtection', { task: 'clearList', reason: 'invalid time' })
      }
    })

    socket.on('POSTpaied', (data) => {
      logdebug('POSTpaied - GETpaied: %o', data)
      global.panf.paied.push(data)
      io.emit('GETpaied', data)
    })

    socket.on('POSTorder', (data) => {
      logdebug('POSTorder got data: %o', data)
      for (let idx = 0; idx < global.panf.orders.length; idx++) {
        const order = global.panf.orders[idx]
        if (order.name === data.name) {
          logdebug(data.name, ' steht schon auf der liste!')
          return socket.emit('FAILorder', data)
        }
      }

      logdebug(' - GETorder: %o', data)
      data.tableId = global.panf.tableId++
      global.panf.orders.push(data)
      io.emit('GETorder', data)
    })
  })
}
