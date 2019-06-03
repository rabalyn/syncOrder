import debug from 'debug'

const express = require('express')
const router = express.Router()

const loginfo = debug('panf:routes:order:info')
const logdebug = debug('panf:routes:order:debug')
loginfo.log = console.log.bind(console)
logdebug.log = console.log.bind(console)

router.get('/getAllOrderList', (req, res) => {
  logdebug('/getAllOrderList - sending: %o', global.panf.orders)
  logdebug(req.session.id)
  res.json(global.panf.orders)
})

module.exports = router
