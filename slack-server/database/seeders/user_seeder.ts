import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '../../app/models/user.js'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await User.create({
      firstName: 'Kevin',
      lastName: 'Smith',
      username: 'Kevin_da_G',
      email: 'kevin.smith@gmail.com',
      password: 'secret_password_123',
      state: '',
    })

    // // Create additional users if needed
    // await User.createMany([
    //   {
    //     username: 'user1',
    //     email: 'user1@example.com',
    //     password: 'password',
    //   },
    //   {
    //     username: 'user2',
    //     email: 'user2@example.com',
    //     password: 'password',
    //   },
    // ])
  }
}
