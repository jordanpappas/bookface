const http = require('http')
const sock = require('socket.io')

module.exports = function(app) {
  const server = http.Server(app.callback())
  const io = sock(server)

  io.on('connection', socket => {
    console.log('someone connected')
    socket.on('test', function() {
      socket.emit('got-test')
      console.log('got test event')
    })
  })
  return server
}
