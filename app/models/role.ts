import { BaseModel, column, manyToMany } from "@adonisjs/lucid/orm";
import { DateTime } from "luxon";
import * as relations from "@adonisjs/lucid/types/relations";

import User from "./user.js";
import Permission from "./permission.js";

export default class Role extends BaseModel {
  @column({ isPrimary: true }) declare id: number
  @column() declare name: string

  @column.dateTime({ autoCreate: true }) declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) declare updatedAt: DateTime

  @manyToMany(() => User, { pivotTable: 'user_has_roles'}) declare users: relations.ManyToMany<typeof User>
  @manyToMany(() => Permission, { pivotTable: 'role_has_permissions' }) declare permissions: relations.ManyToMany<typeof Permission>
}
