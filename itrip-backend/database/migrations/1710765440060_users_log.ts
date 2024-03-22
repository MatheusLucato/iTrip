import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersLogs extends BaseSchema {
  protected tableName = 'users_log'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')

      table.string('data')
      table.string('token')

      
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
