import Moment from 'moment'
import debug from 'debug'

import knex from '../../knex/knex.js'
const KNEX_UPDATE_SUCCESS = 1

const log = debug('panf:lib:socket:info')
const logdebug = debug('panf:lib:socket:debug')
log.log = console.log.bind(console)
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
    log('a user connected')

    socket.on('disconnect', () => {
      log('user disconnected')
    })

    log('initOrders to new user: %O', global.panf.orders)
    socket.emit('initOrders', global.panf.orders)

    log('initPaied to new user: %O', global.panf.paied)
    socket.emit('initPaied', global.panf.paied)

    if (socket && socket.request && socket.request.session && socket.request.session.panf) {
      socket.emit('loadSession', socket.request.session.panf)
    }

    /*
        META DATA
    */
    knex
      .first('caller', 'collector', 'collecttime', 'datestring')
      .from('meta')
      .then((cols) => {
        socket.emit('initMeta', cols)
      })

    socket.on('loadMeta', () => {
      knex
        .first('caller', 'collector', 'collecttime', 'datestring')
        .from('meta')
        .then((cols) => {
          socket.emit('sendMeta', cols)
        })
    })

    socket.on('syncDate', (dateString) => {
      if (dateString) {
        socket.broadcast.emit('pushDate', dateString)
        knex('meta')
          .update({datestring: dateString})
          .then((successState) => {
            if (successState !== KNEX_UPDATE_SUCCESS) {
              logerror('could not update dateString')
            }
          })
      }
    })

    socket.on('syncCollectTime', (collectTime) => {
      socket.broadcast.emit('pushCollectTime', collectTime)
      knex('meta')
        .update({collecttime: collectTime})
        .then((successState) => {
          if (successState !== KNEX_UPDATE_SUCCESS) {
            logerror('could not update collectTime')
          }
        })
    })

    socket.on('syncCaller', (caller) => {
      socket.broadcast.emit('pushCaller', caller)
      knex('meta')
        .update({caller: caller})
        .then((successState) => {
          if (successState !== KNEX_UPDATE_SUCCESS) {
            logerror('could not update caller')
          }
        })
    })

    socket.on('syncCollector', (collector) => {
      socket.broadcast.emit('pushCollector', collector)
      knex('meta')
        .update({collector: collector})
        .then((successState) => {
          if (successState !== KNEX_UPDATE_SUCCESS) {
            logerror('could not update collector')
          }
        })
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
        global.panf.paied = []
        serializer.sync(global.panf.tableId, global.panf.orders, global.panf.meta, global.panf.paied)

        knex('meta')
          .update({caller: '', collector: '', collecttime: '', datestring: ''})
          .then((successState) => {
            if (successState !== KNEX_UPDATE_SUCCESS) {
              logerror('could not update collector')
            }

            // io.sockets.emit('destroySession')
            io.sockets.emit('reloadMeta')
            io.sockets.emit('reloadOrder')
            io.sockets.emit('initOrders')
          })
      } else {
        log('we are in order process...')
        socket.emit('trollProtection', {
          task: 'clearList',
          reason: 'invalid time'
        })
      }
    })

    socket.on('destroySession', () => {
      if (socket && socket.request && socket.request.session && socket.request.session.panf) {
        socket.request.session.destroy()
        io.sockets.emit('loadSession', {})
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
      logdebug('_updateOrder with data: %o', data)
      passedSocket.emit('loadSession', data)
      passedSocket.emit('UPDATEorder', data)
      passedIO.sockets.emit('initOrders', global.panf.orders)
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
      let placeNewOrder = true
      for (let idx = 0; idx < global.panf.orders.length; idx++) {
        const order = global.panf.orders[idx]
        if (order.name === data.name) {
          placeNewOrder = false

          return _updateOrder(socket, io, data)
        }
      }

      if (placeNewOrder) {
        _addOrder(socket, io, data)
      }
    })
  })
}
