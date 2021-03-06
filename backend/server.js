// Express
const express = require('express')
const app = express()

// Cors for Peer
const cors = require('cors')
app.use(cors({origin: 'http://localhost:1234'}));
app.options('*', cors());

// Socket io
const server = require('http').Server(app)
const io = require('socket.io')(server, { cors: { origin: 'http://localhost:1234' } })

// Peer
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});


app.use('/peerjs', peerServer);


io.on('connection', client => {

  client.on('join-room', (roomId, userId) => {
    client.join(roomId)
    client.to(roomId).broadcast.emit('user-connected', userId);

    client.on('disconnect', () => {
      client.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

server.listen(process.env.PORT || 3000);

