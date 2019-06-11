import debug from 'debug'

import fs from 'fs'

import config from './config'

import express from 'express'
import cookieParser from 'cookie-parser'
import session from 'express-session'

const log = debug('panf:app:info')
const logdebug = debug('panf:app:debug')
log.log = console.log.bind(console)
logdebug.log = console.log.bind(console)

const helmet = require('helmet')
const RedisStore = require('connect-redis')(session)

const port = process.env.PORT || config.app.port || 9000
const sharedSession = session({
  store: new RedisStore(),
  secret: config.cookie.secret,
  resave: config.cookie.resave,
  saveUninitialized: config.cookie.saveUninitialized,
  name: 'panf',
  cookie: {
    maxAge: 365 * 24 * 60 * 60 * 1000,
    path: '/',
    httpOnly: true,
    secure: true
  }
})
const app = express()

app.set('trust proxy', 1)

app.use(cookieParser())
app.use(sharedSession)
app.use(
  helmet({
    hsts: false
  })
)

// should be redis instead? or implement postgres store for this + new features like user administration
global.panf = {}
global.panf.tableId =
  fs.readFileSync(config.serialization.tableIdFilestorepath, 'utf-8') || 1
global.panf.orders =
  JSON.parse(
    fs.readFileSync(config.serialization.ordersFilestorepath, 'utf-8')
  ) || []
global.panf.meta =
  JSON.parse(
    fs.readFileSync(config.serialization.metaFilestorepath, 'utf-8')
  ) || {}
global.panf.paied =
  JSON.parse(
    fs.readFileSync(config.serialization.paiedFilestorepath, 'utf-8')
  ) || []

const http = require('http').Server(app)
const socket = require('./lib/socketConnection')
socket.panfIO(http, sharedSession, config)

const serializeJson = require('./lib/serializeJson').Serialize(config)

setInterval(function () {
  serializeJson.sync(
    global.panf.tableId,
    global.panf.orders,
    global.panf.meta,
    global.panf.paied
  )
}, config.serialization.interval)

const router = require('./routes')
app.use(router)

http.listen(port, () => {
  log('Listening on port %d', port)
})
