import type { HttpContext } from '@adonisjs/core/http'
import Message from '#models/message'

export default class MessagesController {
  async getChannelMessages({ request, response }: HttpContext) {
    try {
      const channelId = request.param('channelId')
      const page = request.input('page', 1)
      const limit = request.input('limit', 50)

      const messages = await Message.query()
        .where('channel_id', channelId)
        .orderBy('created_at', 'desc')
        .paginate(page, limit)

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
      const data = request.only(['channelId', 'authorId', 'text'])

      const message = await Message.create(data)

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
