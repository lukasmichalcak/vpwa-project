import type { HttpContext } from '@adonisjs/core/http'
import Message from '#models/message'
import User from '#models/user'

export default class MessagesController {
  async getChannelMessages({ request, response }: HttpContext) {
    try {
      const channelId = request.param('channelId')

      const messages = await Message.query()
        .where('channel_id', channelId)
        .orderBy('created_at', 'asc')
        .preload('author', (query) => {
          query.select('id', 'username') // Adjust fields as needed
        })

      return response.json(messages)
    } catch (error) {
      console.error('Error fetching channel messages:', error)
      return response.status(500).json({
        error: 'Failed to fetch messages',
        details: error.message,
      })
    }
  }

  async storeMessage({ request, response }: HttpContext) {
    try {
      const { channelId, text, username } = request.only(['channelId', 'text', 'username'])

      const user = await User.findByOrFail('username', username)
      const message = await Message.create({
        channelId,
        authorId: user.id,
        text,
      })

      return response.status(201).json(message)
    } catch (error) {
      console.error('Error storing message:', error)
      return response.status(500).json({
        error: 'Failed to store message',
        details: error.message,
      })
    }
  }
}
