import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Channel from '../../app/models/channel.js'
import User from '../../app/models/user.js'
import { faker } from '@faker-js/faker'

export default class ChannelSeeder extends BaseSeeder {
  public async run() {
    const usedNames = new Set<string>()

    const users = await User.all()
    const userIds = users.map((user) => user.id)

    if (userIds.length === 0) {
      console.error('No users found in the database. Seed users first.')
      return
    }

    const generateUniqueChannelData = () => {
      let name

      do {
        name = faker.helpers.slugify(faker.word.adjective() + '-' + faker.word.noun())
      } while (usedNames.has(name))
      usedNames.add(name)

      const adminId = faker.helpers.arrayElement(userIds)
      const channelType = faker.helpers.arrayElement(['private', 'public'])

      return {
        name,
        adminId,
        channelType,
      }
    }

    const numberOfChannels = 100

    for (let i = 0; i < numberOfChannels; i++) {
      const channelData = generateUniqueChannelData()
      await Channel.create(channelData)
    }
  }
}
