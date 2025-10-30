import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'

import TalentSkill from './talent_skill.js'
import JobOffer from './job_offer.js'

export default class Skill extends BaseModel {
  @column({ isPrimary: true }) declare id: number
  @column() declare name: string
  @column() declare category: string

  @column.dateTime({ autoCreate: true }) declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) declare updatedAt: DateTime
  @column.dateTime() declare deletedAt: DateTime | null

  @manyToMany(() => JobOffer, { pivotTable: 'jobs_offer_skills', pivotForeignKey: 'skill_id' }) declare jobOffers: relations.ManyToMany<typeof JobOffer>
  @hasMany(() => TalentSkill) declare talentSkills: relations.HasMany<typeof TalentSkill>
}
