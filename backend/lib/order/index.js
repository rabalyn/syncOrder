import knex from '../../knex/knex.js'

import debug from 'debug'

const log = debug('panf:lib:order:info')
log.log = console.log.bind(console)

function _readActiveOrderId() {
  return new Promise(async (resolve, reject) => {
    const dbQuery = knex('config')
      .select('active_order')
      .first()

    try {
      const row = await dbQuery
      log('_readActiveOrderId - row: %O', row)
      const activeOrderId = (row && row.active_order)
        ? row.active_order
        : null

      return resolve(activeOrderId)
    } catch (error) {
      return reject(error)
    }
  })
}

function _setupNewOrder() {
  return new Promise(async (resolve, reject) => {
    const activeOrderId = await _readActiveOrderId()
    const dbQuery = knex('orders')
      .where('active_order', '=', activeOrderId)
      .first()

    try {
      const activeOrder = await dbQuery
      log('_setupNewOrder - activeOrder: %s', activeOrder)
      // everything is setup, nothing to do
      if (activeOrder && activeOrder.id) {
        return resolve(true)
      }
    } catch (error) {
      return reject(error)
    }

    const insertNewOrder = knex('orders')
      // eslint-disable-next-line
      .insert({active_order: activeOrderId, open: true})

    log('_setupNewOrder SQL: %s', insertNewOrder.toString())

    try {
      await insertNewOrder
    } catch (error) {
      return reject(error)
    }

    return resolve(true)
  })
}

function _initNewOrderId() {
  return new Promise(async (resolve, reject) => {
    log('_initNewOrder')
    const dbQuery = knex('config')
      .select('active_order')
      .first()

    let activeOrderId = null
    const START_INDEX = 0
    const INCREMENT = 1
    try {
      const row = await dbQuery
      activeOrderId = (row && row.active_order)
        ? row.active_order
        : START_INDEX
    } catch (error) {
      return reject(error)
    }

    const newActiveOrderId = (parseInt(activeOrderId) || START_INDEX) + INCREMENT
    const incrementActiveOrderIdQuery = knex('config')
      // eslint-disable-next-line
      .update({active_order: newActiveOrderId})

    log('_initNewOrderId - SQL: %s', incrementActiveOrderIdQuery.toString())

    try {
      await incrementActiveOrderIdQuery
    } catch (error) {
      return reject(error)
    }

    try {
      const activeOrderIdDb = await _readActiveOrderId()
      if (!activeOrderIdDb) {
        const insertConfigRow = knex('config')
          // eslint-disable-next-line
          .insert({active_order: newActiveOrderId})

        await insertConfigRow
      }
    } catch (error) {
      return reject(error)
    }

    return resolve(true)
  })
}

module.exports.prepareNewOrder = function() {
  log('prepareNewOrder')

  return new Promise(async (resolve, reject) => {
    try {
      await _initNewOrderId()
    } catch (error) {
      return reject(error)
    }

    try {
      const result = await _setupNewOrder()

      return resolve(result)
    } catch (error) {
      return reject(error)
    }
  })
}

async function _readOrder(activeOrderId, cb) {
  const dbQuery = knex.table('orders').innerJoin('config', 'config.active_order', '=', 'orders.id')
    .where('config.active_order', '=', activeOrderId)
    .first()

  try {
    const row = await dbQuery

    return cb(null, row)
  } catch (error) {
    return cb(error, null)
  }
}

async function _updateActiveOrder(updateObj, cb) {
  log(updateObj)
  const activeOrderId =  await _readActiveOrderId()
  const dbQuery = knex('orders')
    .update(updateObj)
    .where('active_order', '=', activeOrderId)

  try {
    await dbQuery

    return cb(null, true)
  } catch (error) {
    return cb(error, null)
  }
}

async function _getAllOrders(cb) {
  const dbQuery = knex('orders')
    .select()

  try {
    const rows = await dbQuery

    return cb(null, rows)
  } catch (error) {
    return cb(error, null)
  }
}

async function _getPrepaidCharges(cb) {
  const dbQuery = knex('orders')
    .select()

  try {
    const prepaidCharges = await dbQuery

    return cb(null, prepaidCharges)
  } catch (error) {
    return cb(error, null)
  }
}

module.exports.readActiveOrderId = _readActiveOrderId

module.exports.readOrder = function(activeOrderId) {
  return new Promise((resolve, reject) => {
    _readOrder(activeOrderId, (error, order) => {
      if (error) {
        return reject(error)
      }

      return resolve(order)
    })
  })
}

module.exports.updateActiveOrder = function(updateObj) {
  return new Promise((resolve, reject) => {
    _updateActiveOrder(updateObj, (error, order) => {
      if (error) {
        return reject(error)
      }

      return resolve(order)
    })
  })
}

module.exports.getAllOrders = function() {
  return new Promise((resolve, reject) => {
    _getAllOrders((error, orderlist) => {
      if (error) {
        return reject(error)
      }

      return resolve(orderlist)
    })
  })
}

module.exports.getPrepaidCharges = function() {
  return new Promise((resolve, reject) => {
    _getPrepaidCharges((error, prepaidCharges) => {
      if (error) {
        return reject(error)
      }

      return resolve(prepaidCharges)
    })
  })
}
