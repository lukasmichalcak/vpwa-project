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
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

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
