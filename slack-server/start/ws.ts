import app from '@adonisjs/core/services/app'
import { Server } from 'socket.io'
import server from '@adonisjs/core/services/server'

app.ready(() => {
  const io = new Server(server.getNodeServer(), {
    cors: {
      origin: '*',
    },
  })

  io.on('connection', (socket) => {
    console.log('A new connection', socket.id)

    // Join a channel
    socket.on('join', (channelId) => {
      socket.join(`channel-${channelId}`)
      console.log(`User ${socket.id} joined channel ${channelId}`)
    })

    // Leave a channel
    socket.on('leave', (channelId) => {
      socket.leave(`channel-${channelId}`)
      console.log(`User ${socket.id} left channel ${channelId}`)
    })

    // Handle incoming messages
    socket.on('message', (data) => {
      // Emit the message to all clients in the channel
      io.to(`channel-${data.channelId}`).emit('message', data)
      console.log(`Message sent to channel ${data.channelId}`)
    })

    socket.on('disconnect', () => {
      console.log(`User ${socket.id} disconnected`)
    })
  })
})
