import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import User from './user.js'
import * as relations from '@adonisjs/lucid/types/relations'
import CompanyMember from './company_member.js'
import JobOffer from './job_offer.js'

export default class Company extends BaseModel {
  @column({ isPrimary: true }) declare id: number
  @column() declare admin_id: number
  @column() declare name: string
  @column() declare country: string | null
  @column() declare address: string | null
  @column() declare description: string | null
  @column() declare logo_url: string | null

  @column.dateTime({ autoCreate: true }) declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) declare updatedAt: DateTime
  @column.dateTime() declare deletedAt: DateTime | null

  @belongsTo(() => User, { foreignKey: 'admin_id' }) declare admin: relations.BelongsTo<typeof User>
  @hasMany(() => JobOffer, { foreignKey: 'company_id' }) declare jobOffers: relations.HasMany<typeof JobOffer>
  @hasMany(() => CompanyMember, { foreignKey: 'company_id' }) declare members: relations.HasMany<typeof CompanyMember>
}
