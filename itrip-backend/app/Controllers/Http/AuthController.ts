import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AuthService from 'App/Services/AuthService'


export default class AuthController {
    private authService = new AuthService()

    public async login({ auth, request, response }: HttpContextContract) {
        const email = request.input('email')
        const password = request.input('password')
        return await this.authService.login(auth, email, password, response)
    }

    public async logout({ auth, response }: HttpContextContract) {
        return await this.authService.logout(auth, response)
    }

    public async getTokenLog({ request, response }: HttpContextContract) {
        return await this.authService.getTokenLog(request.input('idUser'), response)
    }

    public async deleteTokenLog({ request, response }: HttpContextContract) {
        return await this.authService.deleteTokenLog(request.input('idUser'), response)
    }

    public async findUserIdByToken({ request, response }: any) {
        return await this.authService.findUserIdByToken(request.input('token'), response)
    }

    public async closeWindowDelete({ request, response }: any) {
        const idUser = await this.authService.findUserIdByToken(request.input('token'), response)
        await this.authService.deleteTokenLog(idUser.user_id, response)
    }   
}