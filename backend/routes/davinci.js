import davinciMenu from '../lib/davinciMenu'
import debug from 'debug'

const loginfo = debug('panf:routes:davinci:info')
const logdebug = debug('panf:routes:davinci:debug')
loginfo.log = console.log.bind(console)
logdebug.log = console.log.bind(console)

const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('davinci')
})

router.get('/getDaVinciMenu', davinciMenu.getMenu)

module.exports = router
