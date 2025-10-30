import { DateTime } from 'luxon'

import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class Notification extends BaseModel {
  static table = 'notifications'

  @column({ isPrimary: true }) declare id: number
  @column() declare user_id: number
  @column() declare title: string
  @column() declare message: string | null
  @column() declare type: 'INFO' | 'SUCCESS' | 'WARNING' | 'INVITATION'
  @column() declare isRead: boolean

  @column.dateTime({ autoCreate: true }) declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) declare updatedAt: DateTime
  @column.dateTime() declare deletedAt: DateTime | null

  @belongsTo(() => User) declare user: BelongsTo<typeof User>
}
