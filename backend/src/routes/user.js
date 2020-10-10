const debug = require('debug')

const express = require('express')
const router = express.Router()

const log = debug('panf-api:routes:user:info')
const logdebug = debug('panf-api:routes:user:debug')
log.log = console.log.bind(console)
logdebug.log = console.log.bind(console)

router.put('/:id', async (req, res) => {
  const {updateObj} = req.body
  const {username, id} = req.session.user

  return res.json({status: 'stub'})
})

module.exports = router
