import type { HttpContext } from '@adonisjs/core/http'
import channel from '#models/channel'
import { createChannelValidator } from '#validators/channel'
import Whitelist from '#models/whitelist'

export default class ChannelsController {
  async createChannel({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createChannelValidator)
      const newChannel = await channel.create(data)

      const newChannelId = newChannel.id

      await Whitelist.create({
        userId: data.admin_id,
        channelId: newChannelId,
      })

      return response.status(201).json(newChannel)
    } catch (error) {
      console.error('Error during channel creation:', error)
      return response.badRequest({ error: error.message })
    }
  }
  async channelList({ auth, response }: HttpContext) {
    try {
      console.log('Fetching channel list for user:', auth.user!.username)
      const user = auth.user!
      const channels = await channel
        .query()
        .join('whitelists', 'channels.id', 'whitelists.channel_id')
        .where('whitelists.user_id', user.id)
        .select('channels.*')
      return channels
    } catch (error) {
      console.error('Error during channel list:', error)
      return response.badRequest({ error: error })
    }
  }
}
