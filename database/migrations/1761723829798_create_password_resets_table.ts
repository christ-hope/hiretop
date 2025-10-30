import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'password_resets'

    /**
   * Table Password_resets
   * ---------------------------------------------------
   * ---------------------------------------------------
   * Reinitialisation de mot de passe
   * ---------------------------------------------------
   * ---------------------------------------------------
   *
   **/

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('email').primary()
      table.string('token').notNullable()
      table.timestamp('created_at').defaultTo(this.now())
      table.timestamp('updated_at').defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
