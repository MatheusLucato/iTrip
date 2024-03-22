import User from 'App/Models/User'
import UsersLog from 'App/Models/Users_Log'
import { DateTime } from 'luxon'

export default class AuthService {

    public async login(auth, email, password, response) {
        const usuario = await User.findBy('email', email)
        if (!usuario) {
            return response.badRequest('Usuário não encontrado')
        }

        try {
            const token = await auth.use('api').attempt(email, password, {
                expiresIn: '120mins',
                name: usuario?.email,
            })

            await this.addTokenLog(token, usuario)

            return { token, usuario: { id: usuario?.id, email: usuario?.email } }
        } catch {
            return response.unauthorized('Credenciais inválidas')
        }
    }

    public async logout(auth, response) {
        try {
            await auth.use('api').revoke()
            return {
                revoked: true
            }
        } catch {
            return response.badRequest('Erro ao fazer logout')
        }
    }


    public async getTokenLog(id, response) {
        try {
            const tokenLog = await UsersLog.findBy('user_id', id)
            if (!tokenLog) {
                return response.notFound('Token não encontrado')
            } else {
                return tokenLog
            }
        } catch (error) {
            console.error('Erro ao verificar token:', error.message)
            return response.internalServerError('Erro ao pegar o token')
        }
    }

    public async addTokenLog(token, usuario) {
        try {
            await UsersLog.updateOrCreate(
              { user_id: usuario.id },
              {
                user_id: usuario.id,
                token: token.token,
                data: DateTime.now().toISO(),
              }
            );
          } catch (error) {
            console.error('Erro ao adicionar token ao log de usuários:', error.message);
            throw new Error('Erro ao adicionar token ao log de usuários');
          }
    }

    public async deleteTokenLog(idUser, response){
        try {
            const logs = await UsersLog.findBy('user_id', idUser);
      
            if (!logs) {
              return response.status(404).send({ message: 'LOG não encontrado' });
            }
      
            await logs.delete();
      
            return response.status(200).send({ message: 'LOG excluído com sucesso' });
          } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            return response.status(500).send({ message: 'Erro ao excluir logs' });
          }
    }

    public async findUserIdByToken(token, response){
        try{
            const idUser = await UsersLog.findBy('token', token);

            if(!idUser){
                return response.status(404).send({ message: 'USERID não encontrado' });
            } else{
                return idUser;
            }

        } catch (error){
            console.error('Erro ao procurar USERID:', error);
            return response.status(500);
        }
    }
    
}
