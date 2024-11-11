import { BaseSeeder } from '@adonisjs/lucid/seeders'
import UserSeeder from '../user_seeder.js'
import ChannelSeeder from '../channel_seeder.js'
import WhitelistSeeder from '../whitelist_seeder.js'

export default class IndexSeeder extends BaseSeeder {
  async run() {
    const userSeeder = new UserSeeder(this.client)
    await userSeeder.run()

    const channelSeeder = new ChannelSeeder(this.client)
    await channelSeeder.run()

    const whitelistSeeder = new WhitelistSeeder(this.client)
    await whitelistSeeder.run()
  }
}
