/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const AuthController = () => import('#controllers/auth_controller')
const ChannelsController = () => import('#controllers/channels_controller')
const UsersController = () => import('#controllers/users_controller')
const MessagesController = () => import('#controllers/messages_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import transmit from '@adonisjs/transmit/services/main'

transmit.registerRoutes()

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('/register', [AuthController, 'register']).as('auth.register')

router.post('/login', [AuthController, 'login']).as('auth.login')

router.delete('/logout', [AuthController, 'logout']).as('auth.logout').use(middleware.auth())

router.get('/me', [AuthController, 'me']).as('auth.me')

router
  .post('/createChannel', [ChannelsController, 'createChannel'])
  .as('channels.create')
  .use(middleware.auth())

router
  .get('/channelList', [ChannelsController, 'channelList'])
  .as('channels.list')
  .use(middleware.auth())

router
  .post('/removeChannel', [ChannelsController, 'removeChannel'])
  .as('channels.remove')
  .use(middleware.auth())

router.post('/broadcast', async ({ request }) => {
  const { channel, message } = request.only(['channel', 'message'])
  transmit.broadcast(channel, { message })
  return { success: true, message: 'Message broadcasted' }
})

router
  .get('/fetchUserChannels', [UsersController, 'getChannelsWithDetails'])
  .as('users.fetch')
  .use(middleware.auth())

router
  .get('/channels/:channelId/messages', [MessagesController, 'getChannelMessages'])
  .as('messages.list')
  .use(middleware.auth())

router
  .post('/channels/:channelId/messages', [MessagesController, 'storeMessage'])
  .as('messages.store')
