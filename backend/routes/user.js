import knex from '../knex/knex.js'

import debug from 'debug'

const express = require('express')
const router = express.Router()

const log = debug('panf:routes:user:info')
const logdebug = debug('panf:routes:user:debug')
log.log = console.log.bind(console)
logdebug.log = console.log.bind(console)

function _updateObject(obj) {
  for (let i = 1; i < arguments.length; i++) {
    for (const prop in arguments[i]) {
      const val = arguments[i][prop]
      if (typeof val === 'object') {
        _updateObject(obj[prop], val)
      } else {
        obj[prop] = val
      }
    }
  }

  return obj
}

router.post('/updateme', async (req, res) => {
  const {updateObj} = req.body
  const {username, id} = req.session.user

  log(req.session.user)
  const dbQuery = knex('users')
    .update(updateObj)
    .where('id', '=', id)

  log(dbQuery.toString())
  try {
    await dbQuery
  } catch (error) {
    res.statusCode = 500

    return res.json({status: 'update user failed'})
  }

  _updateObject(req.session.user, updateObj)

  return res.json({status: 'update user successfull'})
})

module.exports = router
