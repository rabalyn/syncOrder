const knex = require('../../knex/knex.js')

const debug = require('debug')

const log = debug('panf-api:lib:order:info')
log.log = console.log.bind(console)

async function _readActiveOrderId () {
  try {
    const configActiveOrder = await knex('config')
      .select('active_order')
      .first()

    return configActiveOrder.active_order
  } catch (error) {
    return new Error(error)
  }
}

async function _readOrderById (orderId) {
  try {
    const order = knex('orders')
      .where({ id: orderId })

    return order
  } catch (error) {
    return new Error(error)
  }
}

async function _readClosedOrders () {
  try {
    const closedOrders = knex('orders')
      .where({ open: false })

    return closedOrders
  } catch (error) {
    return new Error(error)
  }
}

async function _readOpenOrders () {
  try {
    const openOrders = knex('orders')
      .where({ open: true })

    return openOrders
  } catch (error) {
    return new Error(error)
  }
}

async function _closeOrderById (orderId) {
  try {
    await knex('orders')
      .update({ open: false })
      .where({ id: orderId })

    return true
  } catch (error) {
    return new Error(error)
  }
}

async function _closeAllOrders () {
  try {
    const openOrders = await _readOpenOrders()

    for (let i = 0; i < openOrders.length; i++) {
      const order = openOrders[i]
      _closeOrderById(order.id)
    }
  } catch (error) {
    return new Error(error)
  }
}

async function _createNewOrder () {
  try {
    const currentOrderId = await _readActiveOrderId()
    log('currentOrderId: %s', currentOrderId)
    await _closeOrderById(currentOrderId)
  } catch (error) {
    return new Error(error)
  }

  try {
    const newCurrentOrderId = await knex('orders')
      .insert({ open: true })
      .returning('id')

    await knex('config')
      .update({ active_order: newCurrentOrderId[0] })
  } catch (error) {
    return new Error(error)
  }
}

(async function () {
  try {
    log('activeOrderId: %s', await _readActiveOrderId())

    log('order: %O', await _readOrderById(await _readActiveOrderId()))

    log('open order count: %O', (await _readOpenOrders()).length)
  } catch (error) {
    console.error(error)
  }
})()

module.exports = {

}
