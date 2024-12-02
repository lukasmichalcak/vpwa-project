import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import { faker } from '@faker-js/faker'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await User.create({
      firstName: 'Kevin',
      lastName: 'Smith',
      username: 'Kevin_da_G',
      email: 'kevin.smith@gmail.com',
      password: 'secret_password_123',
      state: null,
    })

    const usedEmails = new Set<string>()
    const usedUsernames = new Set<string>()

    const generateUniqueUserData = () => {
      let email
      let username

      do {
        email = faker.internet.email().toLowerCase()
      } while (usedEmails.has(email))
      usedEmails.add(email)

      do {
        username = faker.internet.username()
      } while (usedUsernames.has(username) || username.length < 2)
      usedUsernames.add(username)

      return {
        email,
        username,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        password: faker.internet.password({ length: 15 }),
        state: null,
      }
    }

    const numberOfUsers = 10

    for (let i = 0; i < numberOfUsers; i++) {
      const userData = generateUniqueUserData()
      await User.create(userData)
    }
  }
}
