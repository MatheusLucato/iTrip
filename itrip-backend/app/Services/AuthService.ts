
import User from 'App/Models/User'
import UsersLog from 'App/Models/Users_Log'
import { DateTime } from 'luxon'
import { encrypt, decrypt } from '../../config/crypto'

export default class AuthService {

    public async login(auth, username, password, response) {
        const usuario = await User.findBy('username', username);
        if (!usuario) {
            return response.badRequest('Usuário não encontrado');
        }
    
        try {
            if (decrypt(usuario.password) == password) {

                const token = await auth.use('api').generate(usuario, {
                    expiresIn: '120mins'
                });


                await this.addTokenLog(token, usuario);
    
                return response.ok({ message: 'Sucesso!', token, usuario: { id: usuario.id, username: usuario.username } });
            } else {
                return response.unauthorized('Credenciais inválidas');
            }
        } catch (error) {
            console.log(error);
            return response.internalServerError('Erro ao processar login');
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
    
    public async register(auth, username, password, cpf, cep, ismotorista, cnh, response){
        try {
            const existingUser = await User.findBy('username', username);
            const existingCPF = await User.findBy('cpf', cpf);
            if (existingUser) {
                return response.badRequest('O username já está em uso');
            }
            if (existingCPF) {
                return response.badRequest('O cpf já está em uso');
            }
    
            if(ismotorista){
                const existingCNH = await User.findBy('cnh', cnh);
                if (existingCNH) {
                    return response.badRequest('A cnh já está em uso');
                }
            }
    
            const user = await User.create({
                username,
                password,
                cpf,
                cep,
                ismotorista,
                cnh
            });
    
            const token = await auth.use('api').generate(user, {
                expiresIn: '120mins',
                name: user.username,
            });
    
            await this.addTokenLog(token, user);
    
            return { token, usuario: { id: user.id, username: user.username, cpf: user.cpf, cep: user.cep, isMotorista: user.ismotorista, cnh: user.cnh } }
        } catch (error) {
            console.error('Erro ao registrar usuário:', error);
            return response.status(500).send({ message: 'Erro ao registrar usuário' });
        }
    }
    
}
