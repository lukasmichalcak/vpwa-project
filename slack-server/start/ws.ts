import app from '@adonisjs/core/services/app'
import { Server } from 'socket.io'
import server from '@adonisjs/core/services/server'
import CommandsService from '#services/commands'
import User from '#models/user'

const userSockets: { [key: string]: string } = {}

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

    if (typeof name === 'string') {
      userSockets[name] = socket.id
    }

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

    socket.on('cancel-command', async (data) => {
      const { channelId, username } = data
      const commandService = new CommandsService()
      const result = await commandService.cancel(channelId, username)
      if (result.success) {
        const channel = result.channel

        if (channel) {
          if (result.user.id === channel.adminId) {
            io.to(`channel-${channelId}`).emit('channel-deleted')
          } else {
            io.to(`channel-${channelId}`).emit('user-left-channel', {
              channel: result.channel,
              user: result.user,
            })
          }
        } else {
          console.log('Failed to locate the /cancel-ed channel')
        }
      } else {
        console.log('Failed to /cancel channel by user')
      }
    })

    socket.on('quit-command', async (data) => {
      const { channelId, username } = data
      const commandService = new CommandsService()
      const result = await commandService.quit(channelId, username)
      if (result.success) {
        const channel = result.channel

        if (channel) {
          io.to(`channel-${channelId}`).emit('channel-deleted')
        } else {
          console.log('Failed to locate the /quit-ed channel')
        }
      } else {
        console.log('Failed to /quit channel')
      }
    })

    socket.on('invite-command', async (data) => {
      const { channelId, username, invitee } = data
      const commandService = new CommandsService()
      const result = await commandService.invite(channelId, username, invitee)
      if (result.success) {
        const channel = result.channel

        if (channel) {
          const inviteeSocketId = userSockets[invitee]
          if (inviteeSocketId) {
            const inviteeSocket = io.sockets.sockets.get(inviteeSocketId)
            if (inviteeSocket) {
              inviteeSocket.join(`channel-${channelId}`)
              console.log(`Invitee ${invitee} joined channel-${channelId}`)
            } else {
              console.log(`Invitee ${invitee} is not currently connected.`)
            }
          }

          io.to(`channel-${channelId}`).emit('user-invited-to-channel', {
            channel: result.channel,
            invitee: result.inviteeUser,
          })
        } else {
          console.log('Failed to locate the joined channel')
        }
      } else {
        console.log('Failed to join user')
      }
    })

    socket.on('kick-command', async (data) => {
      const { channelId, username, kickee } = data
      const commandService = new CommandsService()
      const result = await commandService.kick(channelId, username, kickee)
      if (result.success) {
        const channel = result.channel

        if (channel) {
          const kickeeSocketId = userSockets[kickee]
          if (kickeeSocketId) {
            const kickeeSocket = io.sockets.sockets.get(kickeeSocketId)
            if (kickeeSocket) {
              kickeeSocket.join(`channel-${channelId}`)
              console.log(`Kickee ${kickee} joined channel-${channelId}`)
            } else {
              console.log(`Kickee ${kickee} is not currently connected.`)
            }
          }

          io.to(`channel-${channelId}`).emit('user-kicked-from-channel', {
            channel: result.channel,
            kickee: result.kickeeUser,
          })
        } else {
          console.log('Failed to locate the /kick channel')
        }
      } else {
        console.log('Failed to kick user')
      }
    })

    socket.on('revoke-command', async (data) => {
      const { channelId, username, revokee } = data
      const commandService = new CommandsService()
      const result = await commandService.revoke(channelId, username, revokee)
      if (result.success) {
        const channel = result.channel

        if (channel) {
          const revokeeSocketId = userSockets[revokee]
          if (revokeeSocketId) {
            const revokeeSocket = io.sockets.sockets.get(revokeeSocketId)
            if (revokeeSocket) {
              revokeeSocket.join(`channel-${channelId}`)
              console.log(`Revokee ${revokee} joined channel-${channelId}`)
            } else {
              console.log(`Revokee ${revokee} is not currently connected.`)
            }
          }

          io.to(`channel-${channelId}`).emit('user-kicked-from-channel', {
            channel: result.channel,
            kickee: result.revokeeUser, // we use kickee so that we can emit the same event and call the same socket event handler
          })
        } else {
          console.log('Failed to locate the /revoke channel')
        }
      } else {
        console.log('Failed to revoke user')
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
        if (typeof name === 'string') {
          delete userSockets[name]
        }
      } catch (error) {
        console.error('Error updating user status:', error)
      }
      console.log(`User ${socket.id} disconnected`)
    })
  })
})
