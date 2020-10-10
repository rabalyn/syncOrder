const debug = require('debug')

const config = require('./config')
const dotenv = require('dotenv')

const express = require('express')
const router = require('./routes')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const session = require('express-session')
const redis = require('redis')
const ConnectRedis = require('connect-redis')
const http = require('http')
const socket = require('./lib/socketConnection')

const log = debug('panf:app:info')
const logdebug = debug('panf:app:debug')
const logerror = debug('panf:app:error')
log.log = console.log.bind(console)
logdebug.log = console.log.bind(console)

dotenv.config()

const RedisStore = new ConnectRedis(session)

const port = process.env.PORT || 1337

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  db: process.env.REDIS_DB_COUNT
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
    maxAge: 365 * 24 * 60 * 60 * 1000,
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
