import express from 'express'

const router = express.Router()

const order = require('./order')

router.use('/order', order)
router.use('/hobbit', require('./hobbit'))
router.use('/davinci', require('./davinci'))

module.exports = router
