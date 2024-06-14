import { v4 as uuidv4 } from 'uuid'
import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate, beforeSave } from '@ioc:Adonis/Lucid/Orm'
import { encrypt } from '../../config/crypto'

export default class User extends BaseModel {
  public static table = 'users'

  @column({ isPrimary: true })
  public id: number

  @column()
  public secure_id: string

  @column()
  public username: string

  @column()
  public password: string

  @column()
  public cpf: string

  @column()
  public cep: string

  @column()
  public ismotorista: boolean

  @column()
  public cnh: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(usuario: User) {
    usuario.secure_id = uuidv4()
  }

  @beforeSave()
  public static async hashPassword(usuario: User) {
    usuario.password = await encrypt(usuario.password)
  }
  
}