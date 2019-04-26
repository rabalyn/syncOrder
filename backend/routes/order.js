const express = require('express')
const router = express.Router()

import debug from 'debug'
const loginfo = debug('panf:routes:order:info')
const logerror = debug('panf:routes:order:error')
const logdebug = debug('panf:routes:order:debug')
loginfo.log = console.log.bind(console)
logdebug.log = console.log.bind(console)

router.get('/getAllOrderList', (req, res) => {
  logdebug('/getAllOrderList - sending: %o', global.panf.orders)
  res.json(global.panf.orders)
})

module.exports = router