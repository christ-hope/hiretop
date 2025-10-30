import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany, hasOne, manyToMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import * as relations from '@adonisjs/lucid/types/relations'

import Company from './company.js'
import CompanyMember from './company_member.js'
import Permission from './permission.js'
import Role from './role.js'
import TalentProfile from './talent_profile.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true }) declare id: number

  @column() declare firstname: string
  @column() declare lastname: string
  @column() declare email: string
  @column() declare profile: string
  @column({ serializeAs: null }) declare password: string

  @column.dateTime({ autoCreate: true }) declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) declare updatedAt: DateTime | null
  @column.dateTime() declare deleletedAt: DateTime | null

  @hasOne(() => TalentProfile) declare talentProfile: relations.HasOne<typeof TalentProfile>
  @hasOne(() => Company) declare company: relations.HasOne<typeof Company>

  @hasMany(() => CompanyMember, { foreignKey: 'user_id' }) declare companyMemberships: relations.HasMany<typeof CompanyMember>

  @manyToMany(() => Role, { pivotTable: 'user_has_roles' }) declare roles: relations.ManyToMany<typeof Role>
  @manyToMany(() => Permission, { pivotTable: 'user_has_permissions' }) declare permissions: relations.ManyToMany<typeof Permission>

  static accessTokens = DbAccessTokensProvider.forModel(User)
}
