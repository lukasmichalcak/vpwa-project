import Channel from '#models/channel'
import Whitelist from '#models/whitelist'

export default class UserChannelService {
  public async fetchUserChannels(userId: number) {
    const whitelistEntries = await Whitelist.query().where('user_id', userId)

    const channelIds = [...new Set(whitelistEntries.map((entry) => entry.channelId))]

    const channels = await Channel.query()
      .whereIn('id', channelIds)
      .preload('users')
      .preload('messages', (query) => {
        query.preload('author')
      })

    return channels.map((channel) => ({
      id: channel.id,
      name: channel.name,
      users: channel.users.map((user) => ({
        id: user.id,
        username: user.username,
      })),
      messages: channel.messages.map((message) => ({
        id: message.id,
        text: message.text,
        author: {
          id: message.author.id,
          name: message.author.username,
        },
        createdAt: message.createdAt,
      })),
    }))
  }
}
