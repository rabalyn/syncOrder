import debug from 'debug'
import order from '../lib/order'

const express = require('express')
const router = express.Router()

const log = debug('panf:routes:order:info')
const logdebug = debug('panf:routes:order:debug')
const logerror = debug('panf:routes:order:error')
log.log = console.log.bind(console)
logdebug.log = console.log.bind(console)

module.exports = function (panfIO) {
  router.get('/loadSession', (req, res) => {
    res.json(req.session.panf)
  })

  router.get('/newOrder', async (req, res) => {
    log('/newOrder')
    panfIO.emit('reloadMeta')
    try {
      await order.prepareNewOrder()
    } catch (error) {
      logerror('/newOrder: %O', error)
      res.statusCode = 500

      res.end()
    }

    res.json({ status: 'success' })
  })

  router.get('/getAllOrderList', async (req, res) => {
    try {
      const orders = await order.getAllOrders()

      res.json(orders)
    } catch (error) {
      res.statusCode = 500

      res.json(error)
    }
  })

  router.get('/getPrepaidCharges', async (req, res) => {
    try {
      const prepaidCharges = await order.getPrepaidCharges()

      res.json(prepaidCharges)
    } catch (error) {
      res.statusCode = 500

      res.json(error)
    }
  })

  return router
}
