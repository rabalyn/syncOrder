import debug from 'debug'
const loginfo = debug('app:info')
const logerror = debug('app:error')
const logdebug = debug('app:debug')

import fs from 'fs'
import path from 'path'

import express from 'express'
import exphbs from 'express-handlebars'
const port = process.env.PORT || 9000
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
app.use(express.static(path.join(__dirname, 'public')))

const tableIdFilestorepath = path.join(__dirname, 'data', 'tableId.txt')
const ordersFilestorepath = path.join(__dirname, 'data', 'orders.json')
const metaFilestorepath = path.join(__dirname, 'data', 'meta.json')
const paiedFilestorepath = path.join(__dirname, 'data', 'paied.json')

let tableId = fs.readFileSync(tableIdFilestorepath, 'utf-8') || 1
let orders = JSON.parse(fs.readFileSync(ordersFilestorepath, 'utf-8')) || []
let meta = JSON.parse(fs.readFileSync(metaFilestorepath, 'utf-8')) || []
let paied = JSON.parse(fs.readFileSync(paiedFilestorepath, 'utf-8')) || []

function saveState() {
  fs.writeFile(tableIdFilestorepath, tableId.toString(), (err) => {
    if(err) {
      logerror(err)
    }
  })

  saveJsonToFile(ordersFilestorepath, orders)
  saveJsonToFile(metaFilestorepath, meta)
  saveJsonToFile(paiedFilestorepath, paied)
}

function saveJsonToFile(path, data) {
  fs.writeFile(path, JSON.stringify(data), (err) => {
    if(err) {
      logerror(err)
    }
  })
}

setInterval(saveState, 1000 * 60 * 5)

io.on('connection', (socket) => {
  loginfo('a user connected')
  socket.emit('initOrders', orders)
  socket.emit('initMeta', meta)
  socket.emit('initPaied', paied)
  socket.on('disconnect', () => {
    loginfo('user disconnected')
  })
  socket.on('clearList', () => {
    logdebug('clearList')
    tableId = 1
    orders = []
    meta = []
    paied = []
    io.sockets.emit('reload', { receivers: 'everyone' })
  })
  socket.on('POSTpaied', (data) => {
    paied.push(data)
    logdebug(data)
    io.emit('GETpaied', data)
  })
  socket.on('POSTorder', (data) => {
    data.tableId = tableId++
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