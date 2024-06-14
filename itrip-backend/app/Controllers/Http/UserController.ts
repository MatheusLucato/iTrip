import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserService from 'App/Services/UserService'

export default class UserController {
    private userService = new UserService();

    public async changePassword({ auth, request, response }: HttpContextContract) {

        const novaSenha = request.input('novaSenha')
        const senhaAtual = request.input('senhaAtual')
        const token = request.input('token')

        try {
            const isUpdated = await this.userService.changePassword(auth, senhaAtual, novaSenha, token);
            if (isUpdated.token) {
                return response.ok({ message: 'Senha alterada com sucesso!', token: isUpdated.token || null });
            } else {
                return response.badRequest('Ocorreu um erro.');
            }
        } catch (error) {
            console.error(error);
            return response.internalServerError('Erro ao processar a mudança de senha.');
        }
    }
}
