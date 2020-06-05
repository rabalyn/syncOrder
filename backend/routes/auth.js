import knex from '../knex/knex.js'
import bcrypt from 'bcrypt'

import debug from 'debug'

const express = require('express')
const router = express.Router()

const log = debug('panf:routes:auth:info')
const logdebug = debug('panf:routes:auth:debug')
log.log = console.log.bind(console)
logdebug.log = console.log.bind(console)

const HASHROUNDS = 10

router.get('/init', (req, res) => {
  log('/init - req.session', req.session)
  if (req.session.user) {
    res.json(req.session.user)
  } else {
    res.json({})
  }
})

router.post('/register', async (req, res) => {
  const {body} = req
  const {username, password} = body

  const user = await knex
    .first('username')
    .from('users')
    .where({
      'username': username
    })

  if (user) {
    log('username already exists')

    return res.json({status: 'username already exists', register: false})
  }

  log('generating hash')
  const hash = await bcrypt.hash(password, HASHROUNDS)

  log('create user')
  await knex('users')
    .insert({
      username: username,
      displayname: username,
      email: '',
      password: hash
    })

  const TEMPORARY_REDIRECT = 307

  return res.redirect(TEMPORARY_REDIRECT, '/api/auth/login')
})

router.post('/login', async (req, res) => {
  const {username, password} = req.body

  const user = await knex
    .from('users')
    .where({
      username: username
    })
    .first()

  const userPassword = (user && user.password)
    ? user.password
    : null

  if (!userPassword) {
    return res.json(false)
  }

  const loginValid = await bcrypt.compare(password, userPassword)
  log(user)
  if (loginValid) {
    // eslint-disable-next-line
    req.session.user = {
      id: user.id,
      username: user.username,
      displayname: user.displayname,
      email: user.email,
      isAuthed: true
    }
  }

  return res.json(req.session.user)
})

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      logerror(err)
    }

    return res.redirect('/')
  })
})

module.exports = router
