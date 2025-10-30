import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'role_has_permissions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('role_id').unsigned().references('roles.id').onDelete('CASCADE')
      table.integer('permission_id').unsigned().references('permissions.id').onDelete('CASCADE')
      table.primary(['role_id', 'permission_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
