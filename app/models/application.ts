import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'

import TalentProfile from './talent_profile.js'
import JobOffer from './job_offer.js'

export default class Application extends BaseModel {
  @column({ isPrimary: true }) declare id: number
  @column() declare talent_id: number
  @column() declare job_offer_id: number
  @column() declare message: string
  @column() declare document_url: string
  @column() declare status: string

  @column.dateTime({ autoCreate: true }) declare appliedAt: DateTime
  @column.dateTime({ autoCreate: true }) declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) declare updatedAt: DateTime

  @belongsTo(() => TalentProfile) declare user: relations.BelongsTo<typeof TalentProfile>
  @belongsTo(() => JobOffer, { foreignKey: 'job_offer_id'}) declare jobOffer: relations.BelongsTo<typeof JobOffer>
}
