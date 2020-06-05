import debug from 'debug'

import hobbitMenu from '../lib/hobbitMenu'

const express = require('express')
const router = express.Router()
const log = debug('panf:routes:hobbit:info')
const logdebug = debug('panf:routes:hobbit:debug')
log.log = console.log.bind(console)
logdebug.log = console.log.bind(console)

router.get('/', (req, res) => {
  res.render('hobbit')
})

router.get('/getHobbitMenu', (req, res) => {
  hobbitMenu.getMenu(req, res)
})

module.exports = router
