import debug from 'debug'

import config from './config'
import dotenv from 'dotenv'

import express from 'express'
import router from './routes'

import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'

import morgan from 'morgan'
import cors from 'cors'

import session from 'express-session'
import redis from 'redis'
import ConnectRedis from 'connect-redis'

import http from 'http'

import socket from './lib/socketConnection'

const log = debug('panf:app:info')
const logdebug = debug('panf:app:debug')
const logerror = debug('panf:app:error')
log.log = console.log.bind(console)
logdebug.log = console.log.bind(console)

dotenv.config()

const RedisStore = new ConnectRedis(session)

const FALLBACK_PORT = 9000
const port = process.env.PORT || FALLBACK_PORT
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

const store = new RedisStore({ client })

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
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(sharedSession)

app.use(helmet({
  hsts: false
}))

app.use(morgan(':date[iso] :method :url :status :res[content-length] - :response-time ms'))

var corsOptions = {
  origin: ['https://panf-dev.übersprung.de', 'https://panf.übersprung.de'],
  methods: 'GET,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204
}
app.use(cors(corsOptions))

function isAuthed (req, res, next) {
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

app.use((req, res, next) => {
  res.status(404)
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`)
  next(error)
})

app.use((err, req, res, next) => {
  /* eslint-enable no-unused-vars */
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500
  res.status(statusCode)
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  })
})

myServer.listen(port, () => {
  log('Listening on port %d', port)
})
