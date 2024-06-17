import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TravelsSchema extends BaseSchema {
  protected tableName = 'travels'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('uuid').notNullable().unique()
      table.integer('useridrequest').unsigned().notNullable().references('id').inTable('users')
      table.string('originlat', 255).notNullable()
      table.string('originlng', 255).notNullable()
      table.string('destinationlat', 255).notNullable()
      table.string('destinationlng', 255).notNullable()
      table.string('departuredate').notNullable()
      table.string('departuretime').notNullable()
      table.boolean('accepted').notNullable().defaultTo(false)
      table.integer('useriddriver').unsigned().nullable().references('id').inTable('users')
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
