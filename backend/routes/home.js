import debug from 'debug'

const express = require('express')
const router = express.Router()
const loginfo = debug('panf:routes:home:info')
const logdebug = debug('panf:routes:home:debug')
loginfo.log = console.log.bind(console)
logdebug.log = console.log.bind(console)

router.get('/', (req, res) => {
  res.render('home')
})

module.exports = router
