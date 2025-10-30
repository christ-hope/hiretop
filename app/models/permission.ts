import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'

import User from './user.js'
import Role from './role.js'

export default class Permission extends BaseModel {
  @column({ isPrimary: true }) declare id: number
  @column() declare name: string
  @column() declare description: string | null

  @column.dateTime({ autoCreate: true }) declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) declare updatedAt: DateTime

  @manyToMany(() => User, { pivotTable: 'user_has_permissions' })
  declare users: relations.ManyToMany<typeof User>
  @manyToMany(() => Role, { pivotTable: 'role_has_permissions' }) declare roles: relations.ManyToMany<typeof Role>
}
