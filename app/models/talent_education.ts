import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'

import TalentProfile from './talent_profile.js'

export default class TalentEducation extends BaseModel {
  @column({ isPrimary: true }) declare id: number
  @column() declare talent_id: number
  @column() declare degree: string
  @column() declare institution: string
  @column() declare start_at: number | null
  @column() declare end_at: number | null
  @column() declare is_current: boolean
  @column() declare description: string | null

  @column.dateTime({ autoCreate: true }) declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) declare updatedAt: DateTime
  @column.dateTime() declare deletedAt: DateTime | null

  @belongsTo(() => TalentProfile, { foreignKey: 'talent_id'}) declare user: relations.BelongsTo<typeof TalentProfile>
}
