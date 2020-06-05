import davinciMenu from '../lib/davinciMenu'
import debug from 'debug'

const log = debug('panf:routes:davinci:info')
const logdebug = debug('panf:routes:davinci:debug')
log.log = console.log.bind(console)
logdebug.log = console.log.bind(console)

const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('davinci')
})

router.get('/getDaVinciMenu', (req, res) => {
  davinciMenu.getMenu(req, res)
})

module.exports = router
