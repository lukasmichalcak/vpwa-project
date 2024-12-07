import Blacklist from '#models/blacklist'
import User from '#models/user'
import Channel from '#models/channel'

export default class CommandsService {
  public async join(channelName: string, channelType: string, username: string) {
    try {
      console.log(channelName, channelType, username)
      const user = await User.findByOrFail('username', username)
      console.log('user: ', user)

      let channel = await Channel.query().where('name', channelName).first()
      console.log('channel: ', channel)

      if (!channel) {
        channel = await Channel.create({
          name: channelName,
          adminId: user.id,
          channelType: channelType,
        })

        console.log('channel: ', channel)
        await channel.related('users').attach([user.id])
        console.log('channel: ', channel)

        return {
          success: true,
          message: `Channel '${channelName}' created and joined as admin.`,
          user: user,
          channel: channel,
        }
      }

      if (channel.channelType === 'private') {
        return { success: false, message: `Cannot join private channel '${channelName}'.` }
      }

      const blacklistEntry = await Blacklist.query()
        .where('userId', user.id)
        .andWhere('channelId', channel.id)
        .first()

      if (blacklistEntry?.banned) {
        return { success: false, message: `You are banned from channel '${channelName}'.` }
      }

      const isMember = await channel.related('users').query().where('users.id', user.id).first()

      if (isMember) {
        return { success: false, message: `You are already a member of channel '${channelName}'.` }
      }

      await channel.related('users').attach([user.id])

      return {
        success: true,
        message: `Successfully joined channel '${channelName}'.`,
        user: user,
        channel: channel,
      }
    } catch (error) {
      console.error('Error joining channel:', error)
      return { success: false, message: 'An error occurred while processing your request.' }
    }
  }
}
