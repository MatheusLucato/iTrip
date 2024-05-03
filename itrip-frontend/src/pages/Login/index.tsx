import React, { useEffect, useState } from 'react';
import './styles.css';
import { useNavigate } from "react-router-dom";
import api from '../../api/api'
import eyeClosed from '../../img/Olho Fechado.svg'
import eyeOpen from '../../img/Olho.svg'
import axios from 'axios';

export function Login() {
    localStorage.removeItem('token');
    const [isActive, setIsActive] = useState(false);
    const navigate = useNavigate();
    const [username, setusername] = useState("");
    const [password, setPassword] = useState("");
    const [newpass, setNewpass] = useState("");
    const [confirmNewPass, setConfirmNewPass] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordRegister, setShowPasswordRegister] = useState(false);
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState(""); 

    const handleRoleChange = (e: any) => {
        setRole(e.target.value);
    };

    async function login() {
        try {
            const response = await api.post("/api/login", { username, password });
            const { token } = response.data;
            if (token && token.token) {
                const expirationDate = new Date(token.expires_at);
                const currentDate = new Date();
                if (expirationDate > currentDate) {
                    localStorage.setItem("token", token.token);
                    navigate("/home");
                } else {
                    setError("O token de autenticação expirou. Faça login novamente.");
                }
            } else {
                setError("Credenciais inválidas. Verifique seu e-mail e senha.");
            }
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                setError("E-mail ou senha incorreta.");
            } else {
                setError("Ocorreu um erro ao fazer login. Por favor, tente novamente mais tarde.");
            }
        }
    }

    const handleRegisterClick = () => {
        setIsActive(true);
    };

    const handleLoginClick = () => {
        setIsActive(false);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const togglePasswordVisibilityRegister = () => {
        setShowPasswordRegister(!showPasswordRegister);
    };

    async function register() {
        try {
            if (newpass !== confirmNewPass) {
                setError('As senhas não coincidem.');
                return;
            }
            const response = await api.post("/api/register", { username, confirmNewPass });

            const { token } = response.data;
            
            if (token && token.token) {
                const expirationDate = new Date(token.expires_at);
                const currentDate = new Date();
                if (expirationDate > currentDate) {
                    localStorage.setItem("token", token.token);
                    navigate("/home");
                } else {
                    setError("O token de autenticação expirou. Faça login novamente.");
                }
            } else {
                setError("Credenciais inválidas. Verifique seu e-mail e senha.");
            }
        } catch (error) {
            setError('Ocorreu um erro ao registrar. Por favor, tente novamente mais tarde.');
        }
    }

    return (
        <div className='body'>
            <div className={`container ${isActive ? 'active' : ''}`} id="container">
                <div className="flex justify-center items-center h-full">
                    <div className="w-1/2 flex justify-center">
                        <div className="form-container sign-up">
                            <form onSubmit={(e) => { e.preventDefault(); register(); }} >
                                <h1>Preencha os dados</h1>
                                <select className="mt-5 mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option selected>Selecione a categoria da conta</option>
                                    <option value="1">Motorista</option>
                                    <option value="0">Passageiro</option>
                                </select>
                                <input type="hidden" name="_next" value="http://localhost:3000/" />
                                <input type="text" placeholder="Username" id="name" name="name" onChange={(e: any) => setusername(e.target.value)} required />
                                <div className="password-input-container">
                                    <input placeholder="Senha" id="newPass" type={showPasswordRegister ? "text" : "password"} name="newPass" onChange={(e: any) => setNewpass(e.target.value)} required />
                                    <img className="password-icon" src={showPasswordRegister ? eyeOpen : eyeClosed} onClick={togglePasswordVisibilityRegister} alt="Toggle password visibility" />
                                </div>
                                <div className="password-input-container">
                                    <input type={showPasswordRegister ? "text" : "password"} placeholder="Confirma senha" id="confirmNewPass" name="confirmNewPass" onChange={(e: any) => setConfirmNewPass(e.target.value)} required />
                                    <img className="password-icon" src={showPasswordRegister ? eyeOpen : eyeClosed} onClick={togglePasswordVisibilityRegister} alt="Toggle password visibility" />
                                </div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an option</label>
                                
                                <button type="submit">Cadastrar</button>
                            </form>
                        </div>
                    </div>
                    <div className="w-1/2 flex justify-center">
                        <div className="form-container sign-in">
                            <form>
                                <h1>Login</h1>
                                <input type="username" placeholder="Username" value={username} onChange={(e: any) => setusername(e.target.value)} />
                                <div className="password-input-container">
                                    <input className="input-password" type={showPassword ? "text" : "password"} placeholder="Senha" value={password} onChange={(e: any) => setPassword(e.target.value)} />
                                    <img className="password-icon" src={showPassword ? eyeOpen : eyeClosed} onClick={togglePasswordVisibility} alt="Toggle password visibility" />
                                </div>
                                <a href="#">Esqueceu sua senha?</a>
                                <button type="submit" onClick={(e: any) => { e.preventDefault(); login(); }}>Entrar</button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="toggle-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <h1>Já faz parte?</h1>
                            <p>Entre com sua conta!</p>
                            <button onClick={handleLoginClick} id="login">Entrar</button>
                        </div>
                        <div className="toggle-panel toggle-right">
                            <h1>Bem Vindo!</h1>
                            <p>Crie agora mesmo sua conta!</p>
                            <button onClick={handleRegisterClick} id="register">Criar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
