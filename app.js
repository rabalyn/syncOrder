import debug from 'debug'
const loginfo = debug('app:info')
const logerror = debug('app:error')
const logdebug = debug('app:debug')

import path from 'path'

import express from 'express'
import exphbs from 'express-handlebars'
const port = process.env.PORT || 3000
const app = express()

var http = require('http').Server(app);
var io = require('socket.io')(http);

const hbs = exphbs.create({
  defaultLayout: 'main',
  partialsDir: [
    'views/partials/'
  ],
  extname: '.hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public/')))

let orders = []
let meta = []

io.on('connection', (socket) => {
  loginfo('a user connected')
  socket.emit('initOrders', orders)
  socket.emit('initMeta', meta)
  socket.on('disconnect', () => {
    loginfo('user disconnected')
  })
  socket.on('POSTorder', (data) => {
    orders.push(data)
    logdebug(data)
    io.emit('GETorder', data)
  })
  socket.on('syncMeta', (data) => {
    meta.push(data)
    logdebug(data)
    io.emit('pushMeta', data)
  })
})

app.get('/', (req, res) => {
  res.render('home')
})

http.listen(port, () => {
  loginfo('Listening on port %d', port)
})