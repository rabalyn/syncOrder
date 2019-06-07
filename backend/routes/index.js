const express = require('express')
const router = express.Router()

router.use('/order', require('./order.js'))
router.use('/hobbit', require('./hobbit'))
router.use('/davinci', require('./davinci'))

module.exports = router
