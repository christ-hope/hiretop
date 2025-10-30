import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'applications'

  /**
   * Table Application
   * ---------------------------------------------------
   * ---------------------------------------------------
   * Candidature des talents vers les entreprise
   * Les candidatures ont 03 niveau de status
   * PENDING, REJECTED, ACCEPTED
   * ---------------------------------------------------
   * ---------------------------------------------------
   *
   **/
  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('talent_id').unsigned().references('talent_profiles.id').onDelete('CASCADE')
      table.integer('job_offer_id').unsigned().references('job_offers.id').onDelete('CASCADE')
      table.text('message')
      table.string('document_url')
      table.string('status').defaultTo('PENDING')
      table.timestamp('applied_at').defaultTo(this.now())
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
