// app/Controllers/Http/UserController.ts

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UserController {
  public async update({ request, response, auth }: HttpContextContract) {
    try {
      const user = auth.user!
      const data = request.only(['username', 'password'])

      user.merge(data)
      await user.save()

      return response.status(200).json({ message: 'Dados do usuário atualizados com sucesso' })
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error)
      return response.status(500).json({ message: 'Erro interno do servidor' })
    }
  }
}
