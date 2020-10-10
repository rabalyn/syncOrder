const dayjs = require('dayjs')
const isBetween = require('dayjs/plugin/isBetween')
const knex = require('../../knex/knex.js')

dayjs.extend(isBetween)
const KNEX_UPDATE_SUCCESS = 1

function _updateOrder(passedSocket, passedIO, data) {
  const orderId = parseInt(data.orderId)
  logdebug('- UPDATEorder for %d: %o', orderId, data)

  // TODO: knex implementation
  passedSocket.request.session.panf.order = data
  passedSocket.request.session.save()
  logdebug('_updateOrder with data: %o', data)
  passedSocket.emit('loadSession', data)
  passedSocket.emit('UPDATEorder', data)
  passedIO.sockets.emit('initOrders', global.panf.orders)
}

async function _addOrder(passedSocket, passedIO, data) {
  logdebug(' - GETorder: %o', data)
  const {extras, ingredients} = data
  log(ingredients)
  const extrasprice = data.extrasPrice
  const parsedExtrasPrice = parseFloat(extrasprice)
    ? parseFloat(extrasprice)
    : // eslint-disable-next-line
      0.0;

  for (let i = 0; i < extras.length; i++) {
    const {name, price, type} = extras[i]
    log(type)
    const parsedPrice = parseFloat(price)
      ? parseFloat(price)
      : // eslint-disable-next-line
        0.0;
    const row = await knex('extras')
      .first()
      .where('name', '=', name)

    // eslint-disable-next-line
    if (!row && parsedPrice > 0) {
      log('ingredient is missing, adding to "extras"')
      await knex('extras').insert({name, price: parsedPrice})
    } else {
      log('ingredient already in "extras" or without price')
    }
  }

  const row = await knex('orders')
    .first()
    .orderBy('orderid', 'desc')

  log(row)
  const INITIAL_ORDER_NUMBER = 1
  const orderId =
    row && row.orderid
      ? // eslint-disable-next-line
        row.orderid + 1
      : INITIAL_ORDER_NUMBER

  await knex('orders').insert({
    orderid: orderId,
    name: data.name,
    meal: data.meal,
    mealprice: data.mealPrice,
    extrasprice: parsedExtrasPrice
  })

  passedSocket.request.session.panf = socket.request.session.panf || {}
  passedSocket.request.session.panf.order = data
  passedSocket.request.session.save()

  passedSocket.emit('showOrderReceiption', data)
  passedIO.sockets.emit('GETorder', data)
  passedSocket.emit('loadSession', socket.request.session.panf)
}

module.exports = function(socket, io) {
  socket.on('initOrders', () => {
    log('initOrders')
    knex
      .select()
      .from('orders')
      .then((rows) => {
        log('initOrders to new user: %O', rows)
        socket.emit('initOrders', rows)
      })

    if (socket && socket.request && socket.request.session && socket.request.session.panf) {
      socket.emit('loadSession', socket.request.session.panf)
    }
  })

  socket.on('syncPrepaid', (tableList) => {
    log('syncPrepaid')
    log(tableList)
    // global.panf.paied = tableList.map((x) => x.prepaid)
    // io.emit('updatePrepaid', global.panf.paied)
  })

  socket.on('clearList', async () => {
    log('clearList')
    const format = 'HH:mm'
    const before = dayjs('10:00', format)
    const after = dayjs('13:30', format)
    const now = dayjs()
    const listClearable = !now.isBetween(before, after)
    if (listClearable) {
      logdebug('resetting state...')
      await knex('orders').del()

      knex('meta')
        .update({
          caller: '',
          collector: '',
          collecttime: '',
          datestring: ''
        })
        .then((successState) => {
          if (successState !== KNEX_UPDATE_SUCCESS) {
            logerror('could not update collector')
          }

          // io.sockets.emit('destroySession')
          io.sockets.emit('reloadMeta')
          io.sockets.emit('reloadOrder')
          io.sockets.emit('initOrders')
          if (
            socket &&
            socket.request &&
            socket.request.session &&
            socket.request.session.panf
          ) {
            socket.emit('loadSession', socket.request.session.panf)
          }
        })
    } else {
      log('we are in order process...')
      socket.emit('trollProtection', {
        task: 'clearList',
        reason: 'invalid time'
      })
    }
  })

  socket.on('POSTorder', (data) => {
    log('POSTorder')
    knex
      .select()
      .from('orders')
      .then((rows) => {
        let placeNewOrder = true
        for (let idx = 0; idx < rows.length; idx++) {
          const order = rows[idx]
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
