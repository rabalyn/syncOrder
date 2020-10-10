const express = require('express')

const router = express.Router()

module.exports = function (panfIO) {
  router.use('/auth', require('./auth'))
  router.use('/user', require('./user'))
  router.use('/order', require('./order')(panfIO))
  router.use('/ingredients', require('./ingredients')(panfIO))
  router.use('/meals', require('./meals')(panfIO))

  return router
}
