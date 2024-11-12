import transmit from '@adonisjs/transmit/services/main'
import type { HttpContext } from '@adonisjs/core/http'

export default class MessageController {
  async broadcastMessage({ request }: HttpContext) {
    const { message, channel } = request.only(['message', 'channel'])
    transmit.broadcast(channel, { message })
  }
}
