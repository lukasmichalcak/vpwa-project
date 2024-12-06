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

    socket.on('join', (channelId) => {
      socket.join(`channel-${channelId}`)
      console.log(`User ${socket.id} joined channel ${channelId}`)
    })

    socket.on('leave', (channelId) => {
      socket.leave(`channel-${channelId}`)
      console.log(`User ${socket.id} left channel ${channelId}`)
    })

    socket.on('message', (data) => {
      io.to(`channel-${data.channelId}`).emit('message', data)
      console.log(`Message sent to channel ${data.channelId}`)
    })

    socket.on('typing', (data) => {
      socket.to(`channel-${data.channelId}`).emit('typing', data)
      console.log(`Typing event sent to channel ${data.channelId}`)
    })

    socket.on('disconnect', () => {
      console.log(`User ${socket.id} disconnected`)
    })
  })
})
