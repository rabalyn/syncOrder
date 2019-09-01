import debug from 'debug'
import fs from 'fs'

import config from './config'

import express from 'express'
import router from './routes'

import helmet from 'helmet'
import cookieParser from 'cookie-parser'

import session from 'express-session'
import redis from 'redis'
import connectRedis from 'connect-redis'

import http from 'http'

import socket from './lib/socketConnection'
import SerializeJson from './lib/serializeJson'

const log = debug('panf:app:info')
const logdebug = debug('panf:app:debug')
const logerror = debug('panf:app:error')
log.log = console.log.bind(console)
logdebug.log = console.log.bind(console)

const RedisStore = new connectRedis(session)

const FALLBACK_PORT = 9000
const port = process.env.PORT || config.app.port || FALLBACK_PORT
const DAYS_IN_ONE_YEAR = 365
const HOURS_IN_ONE_DAY = 24
const MINUTES_IN_ONE_HOUR = 60
const SECONDS_IN_ONE_MINUTE = 60
const MILLI_FACTOR = 1000
const ONE_YEAR = DAYS_IN_ONE_YEAR * HOURS_IN_ONE_DAY * MINUTES_IN_ONE_HOUR * SECONDS_IN_ONE_MINUTE * MILLI_FACTOR

const client = redis.createClient({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  db: 1
})
client.unref()
client.on('error', logerror)

const store = new RedisStore({client})

const sharedSession = session({
  store: store,
  secret: config.cookie.secret,
  resave: config.cookie.resave,
  saveUninitialized: config.cookie.saveUninitialized,
  name: 'panf',
  cookie: {
    maxAge: ONE_YEAR,
    path: '/',
    httpOnly: true,
    secure: true
  }
})

const app = express()

const COUNT_TRUSTED_PROXIES = 1
app.set('trust proxy', COUNT_TRUSTED_PROXIES)

app.use(cookieParser())
app.use(sharedSession)
app.use(helmet({
  hsts: false
}))

// should be redis instead? or implement postgres store for this + new features like user administration
const DEFAULT_TABLE_ID = 1
global.panf = {}

fs.readFile(config.serialization.tableIdFilestorepath, 'utf-8', (error, data) => {
  if (error) {
    fs.writeFile(config.serialization.tableIdFilestorepath, DEFAULT_TABLE_ID, (err) => {
      if (err) {
        logerror('could not initialize tableId: %O', err)
      } else {
        global.panf.tableId = DEFAULT_TABLE_ID
      }
    })
  } else {
    global.panf.tableId = JSON.parse(data)
  }
})

fs.readFile(config.serialization.ordersFilestorepath, 'utf-8', (error, data) => {
  if (error) {
    fs.writeFile(config.serialization.ordersFilestorepath, '[]', (err) => {
      if (err) {
        logerror('could not initialize orders store: %O', err)
      } else {
        global.panf.orders = []
      }
    })
  } else {
    global.panf.orders = JSON.parse(data)
  }
})

fs.readFile(config.serialization.metaFilestorepath, 'utf-8', (error, data) => {
  if (error) {
    fs.writeFile(config.serialization.metaFilestorepath, '{}', (err) => {
      if (err) {
        logerror('could not initialize meta store: %O', err)
      } else {
        global.panf.meta = {}
      }
    })
  } else {
    global.panf.meta = JSON.parse(data)
  }
})

fs.readFile(config.serialization.paiedFilestorepath, 'utf-8', (error, data) => {
  if (error) {
    fs.writeFile(config.serialization.paiedFilestorepath, '[]', (err) => {
      if (err) {
        logerror('could not initialize paied store: %O', err)
      } else {
        global.panf.paied = []
      }
    })
  } else {
    global.panf.paied = JSON.parse(data)
  }
})

const myServer = new http.Server(app)

socket.panfIO(myServer, sharedSession, config)

const serializeJson = SerializeJson.Serialize(config)

setInterval(() => {
  serializeJson.sync(global.panf.tableId, global.panf.orders, global.panf.meta, global.panf.paied)
}, config.serialization.interval)

app.use(router)

myServer.listen(port, () => {
  log('Listening on port %d', port)
})
