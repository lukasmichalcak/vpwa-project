import transmit from '@adonisjs/transmit/services/main'

transmit.broadcast('global', { message: 'Hello' })
