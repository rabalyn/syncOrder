import debug from 'debug'
const loginfo = debug('panf:app:info')
const logerror = debug('panf:app:error')
const logdebug = debug('panf:app:debug')
loginfo.log = console.log.bind(console)
logdebug.log = console.log.bind(console)

import fs from 'fs'
import path from 'path'

import config from './config'

import express from 'express'
const helmet = require('helmet')
import session from 'express-session'
const RedisStore = require('connect-redis')(session)

const port = process.env.PORT || config.app.port || 9000
const app = express()

app.use(helmet({
  hsts: false
}))

app.use(session({
  store: new RedisStore(),
  secret: config.cookie.secret,
  resave: config.cookie.resave,
  saveUninitialized: config.cookie.saveUninitialized
}))

// should be redis instead? or implement postgres store for this + new features like user administration
global.panf = {}
global.panf.tableId = fs.readFileSync(config.serialization.tableIdFilestorepath, 'utf-8') || 1
global.panf.orders = JSON.parse(fs.readFileSync(config.serialization.ordersFilestorepath, 'utf-8')) || []
global.panf.meta = JSON.parse(fs.readFileSync(config.serialization.metaFilestorepath, 'utf-8')) || {}
global.panf.paied = JSON.parse(fs.readFileSync(config.serialization.paiedFilestorepath, 'utf-8')) || []

const http = require('http').Server(app)
const socket = require('./lib/socketConnection')
socket.panfIO(http, config)

const serializeJson = require('./lib/serializeJson').Serialize(config)

setInterval(function () {
  serializeJson.sync(global.panf.tableId, global.panf.orders, global.panf.meta, global.panf.paied)
}, config.serialization.interval)

const router = require('./routes')
app.use(router)

http.listen(port, () => {
  loginfo('Listening on port %d', port)
})

