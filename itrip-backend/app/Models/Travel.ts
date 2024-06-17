import { v4 as uuidv4 } from 'uuid'
import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate } from '@ioc:Adonis/Lucid/Orm'

export default class Travel extends BaseModel {
  public static table = 'travels'

  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string 

  @column()
  public useridrequest: number

  @column()
  public originlat: string 

  @column()
  public originlng: string 

  @column()
  public destinationlat: string

  @column()
  public destinationlng: string

  @column()
  public departuretime: string 

  @column()
  public departuredate: string 

  @column()
  public accepted: boolean 

  @column()
  public useriddriver: number | null;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async defineUuid(travel: Travel) {
    travel.uuid = uuidv4()
  }
}
