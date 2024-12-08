import app from '@adonisjs/core/services/app'
import { Server } from 'socket.io'
import server from '@adonisjs/core/services/server'
import User from '#models/user'

app.ready(() => {
  const io = new Server(server.getNodeServer(), {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket) => {
    const username = socket.handshake.query.username
    const joinedChannels = new Set() // Track joined channels
    console.log('A new connection', socket.id)

    socket.on('join', (channelId) => {
      socket.join(`channel-${channelId}`)
      joinedChannels.add(channelId) // Add to tracking
      console.log(`User ${socket.id} joined channel ${channelId}`)
    })

    socket.on('leave', (channelId) => {
      socket.leave(`channel-${channelId}`)
      joinedChannels.delete(channelId) // Remove from tracking
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

    socket.on('disconnect', async () => {
      try {
        if (username) {
          const user = await User.findBy('username', username)
          if (user) {
            user.state = 'offline'
            await user.save()

            joinedChannels.forEach((channelId) => {
              io.to(`channel-${channelId}`).emit('userStatus', {
                channelId,
                username,
                state: 'offline',
              })
            })

            console.log(`User ${username} status set to offline`)
          }
        }
      } catch (error) {
        console.error('Error updating user status:', error)
      }
      console.log(`User ${socket.id} disconnected`)
    })
  })
})
