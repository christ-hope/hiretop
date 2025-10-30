import { DateTime } from "luxon";
import { BaseModel, belongsTo, column, hasMany, manyToMany } from "@adonisjs/lucid/orm";
import * as relations from '@adonisjs/lucid/types/relations'

import Company from "./company.js";
import Skill from "./skill.js";
import Application from "./application.js";

export default class JobOffer extends BaseModel {
  @column({ isPrimary: true }) declare id : number
  @column() declare company_id : number
  @column() declare title : string
  @column() declare description : string | null
  @column() declare location : string | null
  @column() declare contract_type : string
  @column() declare status : string
  @column() declare is_active : boolean

  @column.dateTime() declare expire_at : DateTime | null

  @column.dateTime({ autoCreate: true }) declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) declare updatedAt: DateTime | null
  @column.dateTime() declare deleletedAt: DateTime | null

  @belongsTo(() => Company) declare company: relations.BelongsTo<typeof Company>
  @manyToMany(() => Skill, { pivotTable: 'job_offer_skills'}) declare skills: relations.ManyToMany<typeof Skill>
  @hasMany(() => Application) declare applications: relations.HasMany<typeof Application>
}
