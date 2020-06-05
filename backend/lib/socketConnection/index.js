import debug from 'debug'

const log = debug('panf:lib:socket:info')
const logdebug = debug('panf:lib:socket:debug')
log.log = console.log.bind(console)
logdebug.log = console.log.bind(console)

module.exports.panfIO = function(http, sharedSession) {
  const io = require('socket.io')(http)
  io.use(function(socket, next) {
    sharedSession(socket.request, socket.request.res, next)
  })

  io.on('connection', (socket) => {
    log('a user connected')

    socket.on('disconnect', () => {
      log('user disconnected')
    })

    require('./userorder')(io, socket)
    require('./ordermeta')(io, socket)
  })

  return io
}
