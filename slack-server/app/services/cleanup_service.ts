import { DateTime } from 'luxon'
import Channel from '#models/channel'

export default class ChannelCleanupService {
  static async cleanupInactiveChannels() {
    try {
      const thirtyDaysAgo = DateTime.now().minus({ days: 30 })
      // const thirtyDaysAgo = DateTime.now().minus({ minutes: 1 })

      const inactiveChannels = await Channel.query()
        .where('last_message_at', '<', thirtyDaysAgo.toSQL())
        .orWhereNull('last_message_at')

      for (const channel of inactiveChannels) {
        await channel.delete()
      }

      console.log('Inactive channels cleanup completed')
    } catch (error) {
      console.error('Channel cleanup failed:', error)
    }
  }

  static startCleanupInterval() {
    const CLEANUP_INTERVAL = 24 * 60 * 60 * 1000
    // const CLEANUP_INTERVAL = 10000
    setInterval(() => {
      this.cleanupInactiveChannels()
    }, CLEANUP_INTERVAL)
  }
}
