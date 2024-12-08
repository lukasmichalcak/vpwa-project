import app from '@adonisjs/core/services/app'
import { Server } from 'socket.io'
import server from '@adonisjs/core/services/server'
import CommandsService from '#services/commands'
import User from '#models/user'

app.ready(() => {
  const io = new Server(server.getNodeServer(), {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket) => {
    const name = socket.handshake.query.username
    const joinedChannels = new Set() // Track joined channels
    console.log('A new connection', socket.id)

    socket.on('join', async (channelId) => {
      socket.join(`channel-${channelId}`)
      joinedChannels.add(channelId) // Add to tracking
      console.log(`User ${socket.id} joined channel ${channelId}`)
      try {
        if (name) {
          const user = await User.findBy('username', name)
          if (user) {
            user.state = 'online'
            await user.save()

            io.to(`channel-${channelId}`).emit('userStatus', {
              channelId,
              name,
              state: 'online',
            })
            console.log(`User ${name} status set to online`)
          }
        }
      } catch (error) {
        console.error('Error updating user status:', error)
      }
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

    socket.on('userStatus', (data) => {
      joinedChannels.forEach((channelId) => {
        io.to(`channel-${channelId}`).emit('userStatus', {
          channelId,
          name,
          state: data,
        })
      })
    })

    socket.on('disconnect', async () => {
      try {
        if (name) {
          const user = await User.findBy('username', name)
          if (user) {
            user.state = 'offline'
            await user.save()

            joinedChannels.forEach((channelId) => {
              io.to(`channel-${channelId}`).emit('userStatus', {
                channelId,
                name,
                state: 'offline',
              })
            })

            console.log(`User ${name} status set to offline`)
          }
        }
      } catch (error) {
        console.error('Error updating user status:', error)
      }
      console.log(`User ${socket.id} disconnected`)
    })
  })
})
