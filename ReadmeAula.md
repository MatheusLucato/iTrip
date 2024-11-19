Projeto escolhido foi Itrip desenvolvido semestre passado na aula de Experiencia Criativa de um aplicativo de transporte e armazenamento

1-Componentização no Projeto de Configurações de Usuário
A componentização é uma prática importante para tornar o código mais modular, reutilizável e fácil de manter. No contexto do seu projeto, a ideia é transformar diferentes partes da interface de usuário em componentes independentes e configuráveis, facilitando alterações e tornando o código mais organizado.

Neste projeto, a página de configurações foi refatorada para adotar a componentização de maneira eficaz. O formulário de configurações do usuário, que inclui campos como username, password e CNH, foi dividido em componentes reutilizáveis, como o TextField do Material-UI, permitindo que cada campo de entrada fosse facilmente configurado e modificado conforme necessário. Além disso, funções como editar dados e alterar tema também foram isoladas, permitindo que o código fosse mais legível e fácil de manter.


Para implementar a componentização no código de configurações do usuário, podemos dividir a funcionalidade em partes menores, criando componentes reutilizáveis. Vou sugerir alguns componentes que podem ser criados, como o InputField para campos de entrada, ActionButtons para os botões de edição e salvar, e um ThemeToggle para a alternância entre o tema claro e escuro.

Aqui está como podemos estruturar os componentes:

1. Componente InputField.tsx
Este componente será responsável por renderizar os campos de entrada, como username, password e CNH, de forma reutilizável ficando assim

import React from 'react';
import { TextField } from '@mui/material';

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange, disabled }) => {
  return (
    <div className="field">
      <label>{label}</label>
      <TextField
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        fullWidth
      />
    </div>
  );
};

export default InputField;


1.2- Componente ActionButtons.tsx
Este componente gerencia os botões de editar, salvar e cancelar. Ele vai receber funções como toggleEditing e handleUpdateUserData como props para realizar as ações apropriadas.
import React from 'react';
import { Button, Box } from '@mui/material';

interface ActionButtonsProps {
  editing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ editing, onEdit, onSave, onCancel }) => {
  return (
    <Box display="flex" justifyContent="space-between" mt={2}>
      {!editing ? (
        <Button variant="contained" color="primary" onClick={onEdit}>
          Editar
        </Button>
      ) : (
        <>
          <Button variant="contained" color="primary" onClick={onSave}>
            Salvar
          </Button>
          <Button variant="outlined" color="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        </>
      )}
    </Box>
  );
};

export default ActionButtons;


com essas mudanças o código fica mais modular, limpo e fácil de manter, além de ser facilmente escalável caso novos campos ou funcionalidades sejam adicionados no futuro


2-Criação da Funções para as chamadas de API Resquest(Facade)
O padrão Facade é um padrão de design que oferece uma interface unificada e simplificada para gerenciar operações complexas dentro de um sistema. Ao aplicar o Facade, ocultamos a complexidade das interações internas e fornecemos uma interface mais intuitiva e fácil de usar para os consumidores do código

AuthController está assim
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AuthService from 'App/Services/AuthService'


export default class AuthController {
    private authService = new AuthService()

    public async login({ auth, request, response }: HttpContextContract) {
        const username = request.input('username')
        const password = request.input('password')
        return await this.authService.login(auth, username, password, response)
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

    public async register ({ auth, request, response }: any) {
        const username = request.input('username');
        const password = request.input('password');
        const cpf = request.input('cpf');
        const cep = request.input('cep');
        const ismotorista = request.input('isMotorista');
        const cnh = !ismotorista ? '' : request.input('cnh');
    
        return await this.authService.register(auth, username, password, cpf, cep, ismotorista, cnh, response);
    }
    
}

e ficaria assim

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AuthService from 'App/Services/AuthService'

export default class AuthController {
    private authService = new AuthService()

    public async login({ auth, request, response }: HttpContextContract) {
        const username = request.input('username')
        const password = request.input('password')
        return await this.authService.login(auth, username, password, response)
    }

    public async logout({ auth, response }: HttpContextContract) {
        return await this.authService.logout(auth, response)
    }

    public async getTokenLog({ request, response }: HttpContextContract) {
        const idUser = request.input('idUser')
        return await this.authService.getTokenLog(idUser, response)
    }

    public async deleteTokenLog({ request, response }: HttpContextContract) {
        const idUser = request.input('idUser')
        return await this.authService.deleteTokenLog(idUser, response)
    }

    public async findUserIdByToken({ request, response }: HttpContextContract) {
        const token = request.input('token')
        return await this.authService.findUserIdByToken(token, response)
    }

    public async closeWindowDelete({ request, response }: HttpContextContract) {
        const token = request.input('token')
        const userId = await this.authService.findUserIdByToken(token, response)
        await this.authService.deleteTokenLog(userId.user_id, response)
    }

    public async register({ auth, request, response }: HttpContextContract) {
        const username = request.input('username')
        const password = request.input('password')
        const cpf = request.input('cpf')
        const cep = request.input('cep')
        const isMotorista = request.input('isMotorista')
        const cnh = !isMotorista ? '' : request.input('cnh')

        return await this.authService.register(auth, username, password, cpf, cep, isMotorista, cnh, response)
    }
}

juntamente criando um authService para ela que ficaria assim

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthService {
    
    public async login(auth: any, username: string, password: string, response: HttpContextContract['response']) {
        try {
            const user = await auth.use('api').attempt(username, password)
            return response.json({ token: user.token })
        } catch (error) {
            return response.badRequest('Invalid credentials')
        }
    }

    public async logout(auth: any, response: HttpContextContract['response']) {
        try {
            await auth.use('api').revoke()
            return response.status(200).json({ message: 'Logged out successfully' })
        } catch (error) {
            return response.status(500).json({ message: 'Error logging out' })
        }
    }

    public async getTokenLog(idUser: string, response: HttpContextContract['response']) {
        // Lógica de obtenção de token log para o usuário
        return response.json({ token: `Token for user ${idUser}` })
    }

    public async deleteTokenLog(idUser: string, response: HttpContextContract['response']) {
        // Lógica de remoção de token
        return response.json({ message: `Token for user ${idUser} deleted successfully` })
    }

    public async findUserIdByToken(token: string, response: HttpContextContract['response']) {
        // Lógica para encontrar o usuário baseado no token
        return response.json({ user_id: '12345' })
    }

    public async register(auth: any, username: string, password: string, cpf: string, cep: string, isMotorista: boolean, cnh: string, response: HttpContextContract['response']) {
        try {
            const user = await auth.use('api').create({
                username,
                password,
                cpf,
                cep,
                isMotorista,
                cnh
            })
            return response.status(201).json({ message: 'User registered successfully', user })
        } catch (error) {
            return response.status(500).json({ message: 'Error registering user' })
        }
    }
}

Benefícioos:
Encapsulamento: A lógica de autenticação e outras operações são centralizadas no AuthService, evitando duplicação de código.
Manutenção Facilitada: Se houver mudanças na lógica de autenticação ou no processo de registro, você só precisará atualizar o AuthService.
Escalabilidade: Caso o sistema precise de mais funcionalidades de autenticação ou novos métodos de interação com a API


3-Implementação do Padrão Observer para Notificações
O padrão Observer serve para resolver o problema de notificação de mudanças de estado em um sistema de maneira eficiente e desacoplada. Em outras palavras, ele permite que um objeto (sujeito) notifique automaticamente outros objetos dependentes (observadores) sobre mudanças de seu estado, sem que o sujeito precise saber ou se preocupar com os detalhes de quem está sendo notificado.

para implementar o observer eu criaria a classe oberser que ficaria mais ou menos assim
class Observer {
  private observers: Function[] = [];

  public subscribe(observer: Function): void {
    this.observers.push(observer);
  }

  public unsubscribe(observer: Function): void {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  public notify(data: any): void {
    this.observers.forEach(observer => observer(data));
  }
}


e atualizaria minha authService deixando assim

import User from 'App/Models/User'
import UsersLog from 'App/Models/Users_Log'
import { DateTime } from 'luxon'

class AuthService {
  private authObserver = new Observer();

  public subscribeToAuthEvents(observer: Function): void {
    this.authObserver.subscribe(observer);
  }

  public unsubscribeFromAuthEvents(observer: Function): void {
    this.authObserver.unsubscribe(observer);
  }

  public async login(auth, username, password, response) {
    const usuario = await User.findBy('username', username);
    if (!usuario) {
      return response.badRequest('Usuário não encontrado');
    }

    try {
      const token = await auth.use('api').attempt(username, password, {
        expiresIn: '120mins',
        name: usuario?.username,
      });

      await this.addTokenLog(token, usuario);

      // Notificando o login
      this.authObserver.notify({ event: 'login', usuario });

      return { token, usuario: { id: usuario?.id, username: usuario?.username } };
    } catch {
      return response.unauthorized('Credenciais inválidas');
    }
  }

  public async logout(auth, response) {
    try {
      await auth.use('api').revoke();

      // Notificando o logout
      this.authObserver.notify({ event: 'logout' });

      return { revoked: true };
    } catch {
      return response.badRequest('Erro ao fazer logout');
    }
  }

  public async getTokenLog(id, response) {
    try {
      const tokenLog = await UsersLog.findBy('user_id', id);
      if (!tokenLog) {
        return response.notFound('Token não encontrado');
      } else {
        return tokenLog;
      }
    } catch (error) {
      console.error('Erro ao verificar token:', error.message);
      return response.internalServerError('Erro ao pegar o token');
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

  public async deleteTokenLog(idUser, response) {
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

  public async findUserIdByToken(token, response) {
    try {
      const idUser = await UsersLog.findBy('token', token);

      if (!idUser) {
        return response.status(404).send({ message: 'USERID não encontrado' });
      } else {
        return idUser;
      }
    } catch (error) {
      console.error('Erro ao procurar USERID:', error);
      return response.status(500);
    }
  }

  public async register(auth, username, password, cpf, cep, ismotorista, cnh, response) {
    try {
      const existingUser = await User.findBy('username', username);
      const existingCPF = await User.findBy('cpf', cpf);
      if (existingUser) {
        return response.badRequest('O username já está em uso');
      }
      if (existingCPF) {
        return response.badRequest('O cpf já está em uso');
      }

      if (ismotorista) {
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

      const token = await auth.use('api').attempt(username, password, {
        expiresIn: '120mins',
        name: user.username,
      });

      await this.addTokenLog(token, user);


      this.authObserver.notify({ event: 'register', user });

      return {
        token,
        usuario: {
          id: user.id,
          username: user.username,
          cpf: user.cpf,
          cep: user.cep,
          isMotorista: user.ismotorista,
          cnh: user.cnh,
        },
      };
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      return response.status(500).send({ message: 'Erro ao registrar usuário' });
    }
  }
}

agora qualquer parte do meu sistema poderia  se inscrever para ouvir os eventos de login, logout e registro. Por exemplo, um sistema de auditoria ou log pode ser notificado quando um usuário faz login

Benefícios da Implementação do padrão Observer
Desacoplamento: -Separa a lógica de manipulação de dados das notificações.
Reutilização de Código: -Permite o uso do mesmo mecanismo de notificação em diferentes componentes, sem duplicar o código.
Notificações em Tempo Real:
Garante que a interface reaja instantaneamente as mudanças.



4.Aplicando o Padrão Strategy para Validação no front no app.tsx


O padrão Strategy permite definir uma família de algoritmos ou comportamentos que podem ser usados de forma intercambiável, encapsulando cada um deles em classes distintas. Dessa forma, é possível escolher a estratégia apropriada para cada situação, tornando o código mais flexível e modular. No código original do arquivo CartaoModal.js, a função validateInfo é responsável por verificar os dados do cartão. Podemos aplicar o padrão Strategy ao separar as validações específicas de cada campo, organizando-as em diferentes classes de validação. Isso facilita a manutenção e a expansão do código.

4.1- eu criaria a classe para a validação do strategy que ficaria assim

interface TokenValidationStrategy {
  validate(token: string): Promise<boolean>;
}

4.2 - 2. Implementar Estratégias de Validação
Agora criar algumas validações como uma estratégia pode verificar o token no localStorage

Estratégia de Validação por Token no LocalStorage que ficaria mais ou menos assim

class LocalStorageValidationStrategy implements TokenValidationStrategy {
  async validate(token: string): Promise<boolean> {
    const storedToken = localStorage.getItem('token');
    return storedToken === token;
  }
}

Vantagens:
Flexibilidade: Você pode facilmente adicionar novas estratégias de validação sem modificar o código central.
Desacoplamento: O código que executa a validação não precisa saber como ela é feita, ele apenas delega a tarefa ao contexto.
Extensibilidade: Novas formas de validação podem ser adicionadas sem alterar o comportamento do restante da aplicação.


5- Adicionar uma Função Factory para Notificações