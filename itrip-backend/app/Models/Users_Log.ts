import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate } from '@ioc:Adonis/Lucid/Orm'

export default class UserLog extends BaseModel {
  public static table = 'users_log'

  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column()
  public data: string

  @column()
  public token: string;

  @beforeCreate()
  public static assignUuid(userLog: UserLog) {
    userLog.data = DateTime.now().toISO()
  }
}
