import UserChannelService from '#services/user_channel_service'
import User from '#models/user'
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

  async getChannelUsers({ request, response }: HttpContext) {
    try {
      const channelId = request.param('channelId')

      const users = await User.query()
        .join('whitelists', 'users.id', 'whitelists.user_id')
        .join('channels', 'whitelists.channel_id', 'channels.id')
        .where('whitelists.channel_id', channelId) // Filter by channel
        .orderByRaw(`CASE WHEN users.id = channels.admin_id THEN 0 ELSE 1 END`)
        .select('users.*')

      return response.json(users)
    } catch (error) {
      console.error('Error fetching channel messages:', error)
      return response.status(500).json({
        error: 'Failed to fetch messages',
        details: error.message,
      })
    }
  }
}
