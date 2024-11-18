import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Whitelist from '#models/whitelist'
import User from '#models/user'
import Channel from '#models/channel'

export default class WhitelistSeeder extends BaseSeeder {
  public async run() {
    const users = await User.all()
    const channels = await Channel.all()

    const whitelistEntries = []

    for (const user of users) {
      for (const channel of channels) {
        if (user.id === channel.adminId || Math.random() > 0.85) {
          whitelistEntries.push({
            userId: user.id,
            channelId: channel.id,
          })
        }
      }
    }

    await Whitelist.createMany(whitelistEntries)
  }
}
