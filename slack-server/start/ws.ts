// import app from '@adonisjs/core/services/app'
// import { Server } from 'socket.io'
// import server from '@adonisjs/core/services/server'
// import Message from '#models/message'
// import User from '#models/user'

// app.ready(() => {
//   const io = new Server(server.getNodeServer(), {
//     cors: {
//       origin: '*',
//     },
//   })
//   io?.on('connection', (socket) => {
//     console.log('A new connection', socket.id)
//     socket.on('joinChannel', (channelId) => {
//       socket.join(channelId)
//       console.log(`User joined channel: ${channelId}`)
//     })

//     socket.on('message', async (data: Message, user: User) => {
//       const { authorId, text} = data

//       // Save message to the database
//       const message = await Message.create({ channelId, userId, content })

//       // Broadcast message to others in the channel
//       socket.to(channelId).emit('message', message)
//     })

//     socket.on('disconnect', () => {
//       console.log(`User disconnected: ${socket.id}`)
//     })
//   })
// })
