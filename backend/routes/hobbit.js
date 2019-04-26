const express = require('express')
const router = express.Router()

import debug from 'debug'
const loginfo = debug('panf:routes:hobbit:info')
const logerror = debug('panf:routes:hobbit:error')
const logdebug = debug('panf:routes:hobbit:debug')
loginfo.log = console.log.bind(console)
logdebug.log = console.log.bind(console)

import hobbitMenu from '../lib/hobbitMenu'

router.get('/', (req, res) => {
    res.render('hobbit')
})

router.get('/getHobbitMenu', hobbitMenu.getMenu)

module.exports = router