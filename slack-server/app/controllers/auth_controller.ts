import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(registerValidator)

      const user = await User.create(data)
      console.log('User registered:', user)

      return User.accessTokens.create(user)
    } catch (error) {
      console.error('Error during registration:', error)
      return response.badRequest({ error: error })
    }
  }

  async login({ request, response }: HttpContext) {
    const { username, password } = await request.validateUsing(loginValidator)
    console.log('Received login request for username:', username)

    try {
      const user = await User.verifyCredentials(username, password)
      console.log('User verified:', user)
      return User.accessTokens.create(user)
    } catch (error) {
      console.error('Error during login:', error)
      return response.badRequest({ error: 'Invalid credentials' })
    }
  }

  async logout({ auth }: HttpContext) {
    const user = auth.user!
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)

    return { message: 'Logged out successfully' }
  }

  async me({ auth }: HttpContext) {
    await auth.check()

    return { user: auth.user }
  }
}
