import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_has_roles'

    /**
   * Table user_has_roles
   * ---------------------------------------------------
   * ---------------------------------------------------
   * Gestion des roles par utilisateur
   * ---------------------------------------------------
   * ---------------------------------------------------
   *
   **/

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
      table.integer('role_id').unsigned().references('roles.id').onDelete('CASCADE')
      table.primary(['user_id', 'role_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
