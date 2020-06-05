import debug from 'debug'

import config from './config'

import express from 'express'
import router from './routes'

import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'

import session from 'express-session'
import redis from 'redis'
import connectRedis from 'connect-redis'

import http from 'http'

import socket from './lib/socketConnection'

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
  // password: config.redis.password,
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

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use(sharedSession)
app.use(helmet({
  hsts: false
}))

function isAuthed(req, res, next) {
  req.session.reload((err) => {
    if (err) {
      logerror('isAuthed failed: %O', err)
    }

    if (!req.session.user) {
      req.session.user = {
        isAuthed: false
      }
    }
    next()
  })
}

app.use(isAuthed)

const myServer = new http.Server(app)

const panfIO = socket.panfIO(myServer, sharedSession)
app.use(router(panfIO))

myServer.listen(port, () => {
  log('Listening on port %d', port)
})
