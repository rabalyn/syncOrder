const express = require('express')
const router = express.Router()

import hobbitMenu from '../lib/hobbitMenu'

router.get('/', (req, res) => {
    res.render('hobbit')
})

router.get('/getHobbitMenu', hobbitMenu.getMenu)

module.exports = router