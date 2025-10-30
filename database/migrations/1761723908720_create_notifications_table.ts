import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notifications'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
      table.string('title').notNullable()
      table.text('message').notNullable()
      table.enum('type', ['INFO', 'SUCCESS', 'WARNING', 'INVITATION'])
      table.boolean('isRead').defaultTo(false)

      table.datetime('created_at').notNullable().defaultTo(this.now())
      table.datetime('updated_at').notNullable().defaultTo(this.now())
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
