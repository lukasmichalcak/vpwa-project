import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Whitelist from '../../app/models/whitelist.js'
import User from '../../app/models/user.js'
import Channel from '../../app/models/channel.js'

export default class WhitelistSeeder extends BaseSeeder {
  public async run() {
    const users = await User.all()
    const channels = await Channel.all()

    for (const user of users) {
      for (const channel of channels) {
        if (user.id !== channel.adminId && Math.random() > 0.5) {
          await Whitelist.create({
            userId: user.id,
            channelId: channel.id,
          })
        }
      }
    }
  }
}
