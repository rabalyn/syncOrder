import debug from 'debug'

const express = require('express')
const router = express.Router()

const log = debug('panf:routes:order:info')
const logdebug = debug('panf:routes:order:debug')
log.log = console.log.bind(console)
logdebug.log = console.log.bind(console)

router.get('/loadMetadata', (req, res) => {
  res.json(global.panf.meta)
})

router.get('/loadSession', (req, res) => {
  res.json(req.session.panf)
})

router.get('/getAllOrderList', (req, res) => {
  res.json(global.panf.orders)
})

router.get('/getPrepaidCharges', (req, res) => {
  log(global.panf)

  res.json(global.panf.paied)
})

module.exports = router
