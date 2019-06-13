import debug from 'debug'

const express = require('express')
const router = express.Router()

const log = debug('panf:routes:order:info')
const logdebug = debug('panf:routes:order:debug')
log.log = console.log.bind(console)
logdebug.log = console.log.bind(console)

router.get('/getAllOrderList', (req, res) => {
  res.json(global.panf.orders)
})

module.exports = router
