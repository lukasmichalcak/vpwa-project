import UserChannelService from '#services/user_channel_service'
import { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async getChannelsWithDetails({ auth, response }: HttpContext) {
    try {
      const user = auth.user!
      const service = new UserChannelService()
      const channels = await service.fetchUserChannels(user.id)
      return channels
    } catch (error) {
      console.error('Error during channel creation:', error)
      return response.badRequest({ error: error.message })
    }
  }
}
