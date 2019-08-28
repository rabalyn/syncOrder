import knex from '../knex/knex.js'

import debug from 'debug'

const express = require('express')
const router = express.Router()

const log = debug('panf:routes:order:info')
const logdebug = debug('panf:routes:order:debug')
log.log = console.log.bind(console)
logdebug.log = console.log.bind(console)

router.get('/loadMetadata', (req, res) => {
  knex
    .select()
    .from('meta')
    .then((rows) => {
      const metaObj = {}
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        const {key} = row
        const val = row.value
        metaObj[key] = val
      }

      return metaObj
    })
    .then((rows) => res.json(rows))
})

router.get('/loadSession', (req, res) => {
  res.json(req.session.panf)
})

router.get('/getAllOrderList', (req, res) => {
  res.json(global.panf.orders)
})

router.get('/getPrepaidCharges', (req, res) => {
  res.json(global.panf.paied)
})

module.exports = router
