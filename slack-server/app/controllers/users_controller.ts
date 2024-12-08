import UserChannelService from '#services/user_channel_service'
import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

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
        .select(
          'users.id',
          'users.username',
          'users.email',
          'users.first_name',
          'users.last_name',
          'users.state',
          'users.created_at',
          'users.updated_at',
          'channels.admin_id',
          db.raw(`CASE WHEN users.id = channels.admin_id THEN 'admin' ELSE 'member' END as role`)
        )

      const serializedUsers = users.map((user) => {
        return {
          ...user.$attributes,
          role: user.$extras.role, // Add the `role` from extras
        }
      })

      return response.json(serializedUsers)
    } catch (error) {
      console.error('Error fetching channel users:', error)
      return response.status(500).json({
        error: 'Failed to fetch channel users',
        details: error.message,
      })
    }
  }

  async updateUserState({ auth, request, response }: HttpContext) {
    try {
      const user = auth.user!
      const { state } = request.only(['state'])
      user.state = state
      await user.save()
      return { state }
    } catch (error) {
      console.error('Error updating user state:', error)
      return response.badRequest({ error: error.message })
    }
  }
}
