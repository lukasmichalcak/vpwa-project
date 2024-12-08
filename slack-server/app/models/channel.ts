import {
  BaseModel,
  column,
  belongsTo,
  beforeCreate,
  manyToMany,
  hasMany,
} from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Message from '#models/message'
import { DateTime } from 'luxon'

export default class Channel extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare adminId: number

  @column()
  declare channelType: string

  @column()
  declare lastMessageAt: Date

  @manyToMany(() => User, {
    pivotTable: 'whitelists',
    pivotForeignKey: 'channel_id',
    pivotRelatedForeignKey: 'user_id',
  })
  declare users: ManyToMany<typeof User>

  @hasMany(() => Message)
  declare messages: HasMany<typeof Message>

  @belongsTo(() => User, { foreignKey: 'adminId' })
  declare admin: BelongsTo<typeof User>

  @beforeCreate()
  static async setLastMessageAt(channel: Channel) {
    channel.lastMessageAt = DateTime.now().toJSDate()
  }
}
