
import User from 'App/Models/User'
import Users_Log from 'App/Models/Users_Log'
import auth from 'Config/auth';
import addTokenLog from './AuthService'
import AuthService from './AuthService';
import { encrypt, decrypt } from '../../config/crypto'

export default class UserService {
    async changePassword(auth, senhaAtual, novaSenha, token) {
        const authService = new AuthService()

        const usersLog = await Users_Log.findBy('token', token);

        if (!usersLog) {
            return { error: 'Token inválido ou expirado.' };
        }

        const user = await User.find(usersLog.user_id);

        if (!user) {
            return { error: 'Usuário não encontrado.' };
        }


        if (!decrypt(user.password) === senhaAtual) {
            return { error: 'Senha atual incorreta.' };
        }

        try {
            user.password = novaSenha

            await user.save();

            const novoToken = await auth.use('api').generate(user, {
                expiresIn: '120mins',
                name: user.username,
            });

            await authService.addTokenLog(novoToken, user);

            return { token: novoToken };
        } catch (error) {
            console.error('Erro ao mudar a senha:', error);
            return { error: 'Erro ao processar a mudança de senha.' };
        }
    }
}
