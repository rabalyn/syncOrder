import Moment from 'moment'
import debug from 'debug'

const loginfo = debug('panf:lib:socket:info')
const logdebug = debug('panf:lib:socket:debug')
loginfo.log = console.log.bind(console)
logdebug.log = console.log.bind(console)

const serializeJson = require('../serializeJson')
let serializer = null

module.exports.panfIO = function(http, sharedSession, config) {
  serializer = new serializeJson.Serialize(config)

  const io = require('socket.io')(http)
  io.use(function(socket, next) {
    sharedSession(socket.request, socket.request.res, next)
  })

  io.on('connection', (socket) => {
    loginfo('a user connected')

    loginfo('socket.panf: %O', socket.request.session.panf)

    socket.on('disconnect', () => {
      loginfo('user disconnected')
    })

    loginfo('initOrders to new user: %O', global.panf.orders)
    socket.emit('initOrders', global.panf.orders)

    loginfo('initPaied to new user: %O', global.panf.paied)
    socket.emit('initPaied', global.panf.paied)

    if (socket.request.session.panf) {
      socket.emit('loadSession', socket.request.session.panf)
    }

    /*
        META DATA
    */
    socket.emit('initMeta', global.panf.meta)

    socket.on('loadMeta', () => {
      socket.emit('sendMeta', global.panf.meta)
    })

    socket.on('syncDate', (dateString) => {
      global.panf.meta.dateString = dateString
      socket.broadcast.emit('pushDate', dateString)
    })

    socket.on('syncCollectTime', (collectTime) => {
      global.panf.meta.collectTime = collectTime
      socket.broadcast.emit('pushCollectTime', collectTime)
    })

    socket.on('syncCaller', (caller) => {
      global.panf.meta.caller = caller
      socket.broadcast.emit('pushCaller', caller)
    })

    socket.on('syncCollector', (collector) => {
      global.panf.meta.collector = collector
      socket.broadcast.emit('pushCollector', collector)
    })
    /*
        // META DATA
    */

    socket.on('syncPrepaid', (tableList) => {
      global.panf.paied = tableList.map((x) => x.prepaid)
      io.emit('updatePrepaid', global.panf.paied)
    })

    socket.on('clearList', () => {
      const format = 'HH:mm'
      const before = new Moment('10:00', format)
      const after = new Moment('13:30', format)
      const now = new Moment()
      const listClearable = !now.isBetween(before, after)
      if (listClearable) {
        logdebug('resetting state...')
        global.panf.tableId = 1
        global.panf.orders = []
        global.panf.meta = {}
        global.panf.paied = []
        serializer.sync(global.panf.tableId, global.panf.orders, global.panf.meta, global.panf.paied)

        io.sockets.emit('destroySession')
        io.sockets.emit('reloadMeta')
        io.sockets.emit('reloadOrder')
        io.sockets.emit('reloadOrderTable')
      } else {
        logdebug('we are in order process...')
        socket.emit('trollProtection', {
          task: 'clearList',
          reason: 'invalid time'
        })
      }
    })

    socket.on('destroySession', () => {
      loginfo('destroysession')
      if (socket.request.session) {
        socket.request.session.destroy()
        io.sockets.emit('loadSession', socket.request.session.panf)
      } else {
        log('no session to destroy')
      }
    })

    function _updateOrder(passedSocket, passedIO, data) {
      logdebug('- UPDATEorder: %o', data)
      const orderId = parseInt(data.orderId)
      const ARRAY_ZERO_OFFSET = 1
      global.panf.orders[orderId - ARRAY_ZERO_OFFSET] = data
      passedSocket.request.session.panf.order = data
      passedSocket.request.session.save()
      passedIO.sockets.emit('loadSession', socket.request.session.panf)
      passedSocket.emit('UPDATEorder', data)
    }

    function _addOrder(passedSocket, passedIO, data) {
      logdebug(' - GETorder global.panf.tableId: %O', global.panf.tableId)
      logdebug(' - GETorder: %o', data)
      data.orderId = global.panf.tableId++
      global.panf.orders.push(data)

      passedSocket.request.session.panf = socket.request.session.panf || {}
      passedSocket.request.session.panf.order = data
      passedSocket.request.session.save()

      passedSocket.emit('showOrderReceiption', data)
      passedIO.sockets.emit('GETorder', data)
      passedSocket.emit('loadSession', socket.request.session.panf)
    }

    socket.on('POSTorder', (data) => {
      for (let idx = 0; idx < global.panf.orders.length; idx++) {
        const order = global.panf.orders[idx]
        if (order.name === data.name) {
          return _updateOrder(socket, io, data)
        }
      }

      _addOrder(socket, io, data)
    })
  })
}
