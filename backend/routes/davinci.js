const express = require('express')
const router = express.Router()

import davinciMenu from '../lib/davinciMenu'

router.get('/', (req, res) => {
    res.render('davinci')
})

router.get('/getDaVinciMenu', davinciMenu.getMenu)

module.exports = router