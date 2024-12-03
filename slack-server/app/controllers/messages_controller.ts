import type { HttpContext } from '@adonisjs/core/http'
import Message from '#models/message'

export default class MessagesController {
  async getChannelMessages({ request, response, logger }: HttpContext) {
    try {
      const channelId = request.param('channelId')
      const page = request.input('page', 1)
      const limit = request.input('limit', 20)

      logger.info(`Fetching messages for channel ${channelId}, page ${page}, limit ${limit}`)

      // Validate channelId
      if (!channelId) {
        return response.status(400).json({
          error: 'Channel ID is required',
        })
      }

      const messages = await Message.query()
        .where('channel_id', channelId)
        .preload('author')
        .orderBy('created_at', 'desc')
        .paginate(page, limit)

      return response.json({
        data: messages.all(),
        meta: {
          total: messages.total,
          perPage: messages.perPage,
          currentPage: messages.currentPage,
          lastPage: messages.lastPage,
          hasMore: messages.hasMorePages,
        },
      })
    } catch (error) {
      logger.error('Error fetching messages:', error)
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
