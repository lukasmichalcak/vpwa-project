import app from '@adonisjs/core/services/app'
import { Server } from 'socket.io'
import server from '@adonisjs/core/services/server'
import CommandsService from '#services/commands'

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

    socket.on('join-command', async (data) => {
      const { channelName, channelType, username } = data
      const commandService = new CommandsService()
      const result = await commandService.join(channelName, channelType, username)
      // socket.to(`channel-${data.channelId}`).emit('join-command-result', result)
      if (result.success) {
        const channel = result.channel

        if (channel) {
          const channelId = channel.id

          socket.join(`channel-${channelId}`)
          console.log(`User ${socket.id} joined channel-${channelId}`)
          io.to(`channel-${channelId}`).emit('user-joined-channel', {
            channel: result.channel,
            user: result.user,
          })
        } else {
          console.log('Failed to locate the joined channel')
        }
      } else {
        console.log('Failed to join user')
      }
    })

    socket.on('disconnect', () => {
      console.log(`User ${socket.id} disconnected`)
    })
  })
})
