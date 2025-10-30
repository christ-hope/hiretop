import { BaseModel, belongsTo, column } from "@adonisjs/lucid/orm";
import { DateTime } from "luxon";
import Company from "./company.js";
import User from "./user.js";
import * as relations from "@adonisjs/lucid/types/relations";

export default class CompanyMember extends BaseModel {
  @column({ isPrimary: true }) declare id: number
  @column() declare company_id: number
  @column() declare user_id: number

  @column.dateTime({ autoCreate: true }) declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) declare updatedAt: DateTime
  @column.dateTime() declare deletedAt: DateTime | null

  @belongsTo(() => Company, { foreignKey: 'company_id' }) declare company: relations.BelongsTo<typeof Company>
  @belongsTo(() => User, { foreignKey: 'user_id' }) declare user: relations.BelongsTo<typeof User>
}
