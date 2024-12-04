import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Whitelist from '#models/whitelist'
import Message from '#models/message'
import { faker } from '@faker-js/faker'

export default class MessageSeeder extends BaseSeeder {
  public async run() {
    const whitelistEntries = await Whitelist.all()

    if (whitelistEntries.length === 0) {
      console.error('No whitelist entries found. Ensure the whitelist seeder has been run first.')
      return
    }

    const messages = []

    for (const entry of whitelistEntries) {
      const numberOfMessages = faker.number.int({ min: 1, max: 10 })

      for (let i = 0; i < numberOfMessages; i++) {
        messages.push({
          authorId: entry.userId,
          channelId: entry.channelId,
          text: faker.lorem.sentence(),
        })
      }
    }

    await Message.createMany(messages)
  }
}
