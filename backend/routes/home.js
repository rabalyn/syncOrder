const express = require('express')
const router = express.Router()

import debug from 'debug'
const loginfo = debug('panf:routes:home:info')
const logerror = debug('panf:routes:home:error')
const logdebug = debug('panf:routes:home:debug')
loginfo.log = console.log.bind(console)
logdebug.log = console.log.bind(console)


router.get('/', (req, res) => {
    res.render('home')
})

module.exports = router