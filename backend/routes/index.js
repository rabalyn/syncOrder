import express from 'express'

const router = express.Router()

module.exports = function(panfIO) {
  router.use('/auth', require('./auth'))
  router.use('/user', require('./user'))
  router.use('/order', require('./order')(panfIO))
  router.use('/hobbit', require('./hobbit'))
  router.use('/davinci', require('./davinci'))

  return router
}
