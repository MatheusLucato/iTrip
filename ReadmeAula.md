## Projeto escolhodio foi o Itrip Desenvolvido Na materia de Experiência criativa apresentado Semestre passado
## Aluno: julien

1. Componentização no Projeto de Configurações de Usuário
A componentização foi adotada para modularizar a página de configurações, tornando-a mais reutilizável, escalável e fácil de manter.

Refatoração da Página de Configurações
A página de configurações do usuário foi dividida em componentes menores e reutilizáveis. Os campos como username, password, e CNH agora são renderizados utilizando um componente genérico InputField. Botões como editar, salvar, e cancelar foram movidos para um componente chamado ActionButtons. Além disso, a alternância entre temas foi isolada em um componente ThemeToggle.

 ## Componentes Criados
 1.1 Componente InputField.tsx
 Este componente é responsável por renderizar os campos de entrada do formulário.

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

## 1.2 Componente ActionButtons.tsx
Gerencia as ações de editar, salvar, e cancelar, recebendo as funções correspondentes via props.

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

Benefícios
Modularidade: O código agora é mais limpo e organizado.
Reutilização: Os componentes podem ser utilizados em outras partes do sistema.
Escalabilidade: Facilita a adição de novos campos ou funcionalidades no futuro.


 ## 2. Criação de Funções para Chamadas de API (Padrão Facade)
O padrão Facade foi implementado para unificar e simplificar a lógica de autenticação e operações relacionadas. A lógica foi encapsulada em um AuthService, enquanto o AuthController atua como intermediário entre as rotas e o serviço.

AuthController.ts
A refatoração do controller padronizou as chamadas para o serviço de autenticação, eliminando redundâncias.

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import AuthService from 'App/Services/AuthService';

export default class AuthController {
  private authService = new AuthService();

  public async login({ auth, request, response }: HttpContextContract) {
    const username = request.input('username');
    const password = request.input('password');
    return await this.authService.login(auth, username, password, response);
  }

  public async logout({ auth, response }: HttpContextContract) {
    return await this.authService.logout(auth, response);
  }

  public async getTokenLog({ request, response }: HttpContextContract) {
    const idUser = request.input('idUser');
    return await this.authService.getTokenLog(idUser, response);
  }

  public async deleteTokenLog({ request, response }: HttpContextContract) {
    const idUser = request.input('idUser');
    return await this.authService.deleteTokenLog(idUser, response);
  }

  public async findUserIdByToken({ request, response }: HttpContextContract) {
    const token = request.input('token');
    return await this.authService.findUserIdByToken(token, response);
  }

  public async closeWindowDelete({ request, response }: HttpContextContract) {
    const token = request.input('token');
    const userId = await this.authService.findUserIdByToken(token, response);
    await this.authService.deleteTokenLog(userId.user_id, response);
  }

  public async register({ auth, request, response }: HttpContextContract) {
    const username = request.input('username');
    const password = request.input('password');
    const cpf = request.input('cpf');
    const cep = request.input('cep');
    const isMotorista = request.input('isMotorista');
    const cnh = !isMotorista ? '' : request.input('cnh');

    return await this.authService.register(auth, username, password, cpf, cep, isMotorista, cnh, response);
  }
}

AuthService.ts
Toda a lógica de autenticação foi encapsulada neste serviço.

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class AuthService {
  public async login(auth: any, username: string, password: string, response: HttpContextContract['response']) {
    try {
      const user = await auth.use('api').attempt(username, password);
      return response.json({ token: user.token });
    } catch (error) {
      return response.badRequest('Invalid credentials');
    }
  }

  public async logout(auth: any, response: HttpContextContract['response']) {
    try {
      await auth.use('api').revoke();
      return response.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      return response.status(500).json({ message: 'Error logging out' });
    }
  }

  public async getTokenLog(idUser: string, response: HttpContextContract['response']) {
    return response.json({ token: `Token for user ${idUser}` });
  }

  public async deleteTokenLog(idUser: string, response: HttpContextContract['response']) {
    return response.json({ message: `Token for user ${idUser} deleted successfully` });
  }

  public async findUserIdByToken(token: string, response: HttpContextContract['response']) {
    return response.json({ user_id: '12345' });
  }

  public async register(auth: any, username: string, password: string, cpf: string, cep: string, isMotorista: boolean, cnh: string, response: HttpContextContract['response']) {
    try {
      const user = await auth.use('api').create({
        username,
        password,
        cpf,
        cep,
        isMotorista,
        cnh,
      });
      return response.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
      return response.status(500).json({ message: 'Error registering user' });
    }
  }
}

Benefícios
Encapsulamento: Centraliza a lógica de autenticação no AuthService.
Manutenção Facilitada: Alterações precisam ser feitas apenas no AuthService.
Reutilização: As funções podem ser facilmente usadas por diferentes controladores.

## 3-Implementação do Padrão Observer para Notificações
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



## 4.Aplicando o Padrão Strategy para Validação no front no app.tsx


O padrão Strategy permite definir uma família de algoritmos ou comportamentos que podem ser usados de forma intercambiável, encapsulando cada um deles em classes distintas. Dessa forma, é possível escolher a estratégia apropriada para cada situação, tornando o código mais flexível e modular. No código original do arquivo CartaoModal.js, a função validateInfo é responsável por verificar os dados do cartão. Podemos aplicar o padrão Strategy ao separar as validações específicas de cada campo, organizando-as em diferentes classes de validação. Isso facilita a manutenção e a expansão do código.

## 4.1- eu criaria a classe para a validação do strategy que ficaria assim

interface TokenValidationStrategy {
  validate(token: string): Promise<boolean>;
}

## 4.2 - 2. Implementar Estratégias de Validação
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


## 5- Adicionar uma Função Factory para Notificações
Factory é um padrão criacional fornecem uma interface para criar objetos em uma superclasse, mas permite as subclasses alterem o tipo de objetos que serão criados.

Código atual
import { Avatar, Box, IconButton, useTheme } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SearchIcon from "@mui/icons-material/Search";
import userLogo from "../../img/userLogo.png";
import { LogOutIcon } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LogoutOutlined } from "@mui/icons-material";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const theme = useTheme();
  const navigate = useNavigate()

  async function logout() {
    try {
        deleteTokenLog();
        await api.post("/api/logout");
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        navigate("/login");
    } catch (error: any) {
        console.log("Não foi possivel realizar o logout!");
    }
}

async function deleteTokenLog() {
    try {
        const token = localStorage.getItem('token')
        const idUser = (await api.post('/api/findUserIdByToken', { token })).data.user_id
        const response = await api.post('/api/deleteTokenLog', { idUser });
    } catch (error: any) {

    }
}

async function user() {
  try {
        navigate("/user");
  } catch (error: any) {
  }
}

const handleSettingsClick = () => {
  navigate("/Ajustes");
};


  return (
    <div>

      <Box
        display="flex"
        justifyContent="space-between"
        p={2}
        style={{ backgroundColor: "#F3F4F6", borderLeft: "1px", maxHeight: "60px" }}
      >
        <Box
          sx={{ display: "flex", borderRadius: "3px", backgroundColor: "#D1D5DB" }}
        >

        </Box>
        <a href="/home">

          <h1 className="text-gray-700 origin-left font-medium text-2xl duration-300">iTrip</h1>
        </a>

        <Box display="flex">
          <IconButton>
            <NotificationsOutlinedIcon />
          </IconButton>
          <IconButton onClick={handleSettingsClick}>
            <SettingsOutlinedIcon />
          </IconButton>
          <IconButton>
            <Avatar
              style={{ width: "30px", height: "30px" }}
              src={userLogo}
            />
          </IconButton>
          <IconButton onClick={logout}>
            <LogoutOutlined />
          </IconButton>
        </Box>
      </Box>
    </div>
  );
};

export default Topbar;


código com Função Factory 
import { Avatar, Box, IconButton } from "@mui/material";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlined from "@mui/icons-material/LogoutOutlined";
import userLogo from "../../img/userLogo.png";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

// Função Factory para criar notificações
const createNotification = (type: string, message: string) => {
  return { type, message, timestamp: new Date() };
};

const Topbar = () => {
  const navigate = useNavigate();

  async function logout() {
    try {
      await deleteTokenLog();
      await api.post("/api/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("username");

      const notification = createNotification(
        "success",
        "Logout realizado com sucesso!"
      );
      console.log(notification); // Você pode exibir no console ou integrar com um sistema de notificações.

      navigate("/login");
    } catch (error: any) {
      const notification = createNotification(
        "error",
        "Não foi possível realizar o logout."
      );
      console.error(notification);
    }
  }

  async function deleteTokenLog() {
    try {
      const token = localStorage.getItem("token");
      const idUser = (await api.post("/api/findUserIdByToken", { token })).data
        .user_id;
      await api.post("/api/deleteTokenLog", { idUser });

      const notification = createNotification(
        "info",
        "Token de autenticação removido."
      );
      console.log(notification);
    } catch (error: any) {
      const notification = createNotification(
        "error",
        "Erro ao remover token de autenticação."
      );
      console.error(notification);
    }
  }

  async function user() {
    try {
      navigate("/user");
    } catch (error: any) {
      const notification = createNotification(
        "error",
        "Erro ao navegar para o perfil do usuário."
      );
      console.error(notification);
    }
  }

  const handleSettingsClick = () => {
    navigate("/Ajustes");
    const notification = createNotification(
      "info",
      "Redirecionando para as configurações."
    );
    console.log(notification);
  };

  return (
    <div>
      <Box
        display="flex"
        justifyContent="space-between"
        p={2}
        style={{ backgroundColor: "#F3F4F6", borderLeft: "1px", maxHeight: "60px" }}
      >
        <a href="/home">
          <h1 className="text-gray-700 origin-left font-medium text-2xl duration-300">
            iTrip
          </h1>
        </a>

        <Box display="flex">
          <IconButton>
            <NotificationsOutlinedIcon />
          </IconButton>
          <IconButton onClick={handleSettingsClick}>
            <SettingsOutlinedIcon />
          </IconButton>
          <IconButton>
            <Avatar style={{ width: "30px", height: "30px" }} src={userLogo} />
          </IconButton>
          <IconButton onClick={logout}>
            <LogoutOutlined />
          </IconButton>
        </Box>
      </Box>
    </div>
  );
};

export default Topbar;
Função Factory createNotification:

## 5.1- Essa função aceita dois parâmetros (type e message) e retorna um objeto de notificação padronizado.
Inclui um timestamp automático para rastrear o momento em que a notificação foi criada.
Integração com o Componente:

## 5.2 -Cada ação (logout, deleteTokenLog, handleSettingsClick) utiliza a função createNotification para criar mensagens apropriadas.
Essas notificações podem ser exibidas no console ou integradas com uma biblioteca de notificações (como notistack, toastify, etc.).

## 5.3-Flexibilidade:Com a Factory, você pode facilmente criar diferentes tipos de notificações (success, error, info) em qualquer parte do código.


## Conclusão
Estas refatorações tornam o projeto iTrip mais escalável, modular e de fácil manutenção. A adoção de padrões como Componentização e Facade simplifica a lógica do sistema e permite a integração de novas funcionalidades com menos esforço.