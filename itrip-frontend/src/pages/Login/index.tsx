import React, { useState } from 'react';
import './styles.css';
import { useNavigate } from "react-router-dom";
import api from '../../api/api';
import eyeClosed from '../../img/Olho Fechado.svg';
import eyeOpen from '../../img/Olho.svg';

export function Login() {
    localStorage.removeItem('token');
    const [isActive, setIsActive] = useState(false);
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [newpass, setNewpass] = useState("");
    const [confirmNewPass, setConfirmNewPass] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordRegister, setShowPasswordRegister] = useState(false);
    const [selectedRole, setSelectedRole] = useState("");

    const handleRoleChange = (role: string) => {
        setSelectedRole(role);
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
        } catch (error) {
            setError("Ocorreu um erro ao fazer login. Por favor, tente novamente mais tarde.");
        }
    }

    async function register() {
        try {
            if (newpass !== confirmNewPass) {
                setError('As senhas não coincidem.');
                return;
            }

            const registerData = {
                username,
                password: confirmNewPass,
                role: selectedRole === 'cliente' ? 'cliente' : 'motorista'
            };

            const response = await api.post("/api/register", registerData);

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

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const togglePasswordVisibilityRegister = () => {
        setShowPasswordRegister(!showPasswordRegister);
    };

    return (
        <div className='body'>
        <div className={`container ${isActive ? 'active' : ''}`} id="container">
            <div className="flex justify-center items-center h-full">
                <div className="w-1/2 flex justify-center">
                    <div className="form-container sign-up">
                        <div className="role-selection">
                            <button onClick={() => handleRoleChange('cliente')}>Cliente</button>
                            <button onClick={() => handleRoleChange('motorista')}>Motorista</button>
                        </div>
                        {selectedRole === 'motorista' ? (
                            <form onSubmit={(e) => { e.preventDefault(); register(); }} >
                                <h1>Preencha os dados do Motorista</h1>
                                <input type="hidden" name="_next" value="http://localhost:3000/" />
                                <input type="text" placeholder="Nome" id="name" name="name" onChange={(e) => setUsername(e.target.value)} required />
                                <input type="text" placeholder="CNH" id="cnh" name="cnh" onChange={(e) => setUsername(e.target.value)} required />
                                <div className="password-input-container">
                                    <input placeholder="Senha" id="newPass" type={showPasswordRegister ? "text" : "password"} name="newPass" onChange={(e) => setNewpass(e.target.value)} required />
                                    <img className="password-icon" src={showPasswordRegister ? eyeOpen : eyeClosed} onClick={togglePasswordVisibilityRegister} alt="Toggle password visibility" />
                                </div>
                                <div className="password-input-container">
                                    <input type={showPasswordRegister ? "text" : "password"} placeholder="Confirma senha" id="confirmNewPass" name="confirmNewPass" onChange={(e) => setConfirmNewPass(e.target.value)} required />
                                    <img className="password-icon" src={showPasswordRegister ? eyeOpen : eyeClosed} onClick={togglePasswordVisibilityRegister} alt="Toggle password visibility" />
                                </div>
                                <button type="submit">Cadastrar</button>
                            </form>
                        ) : (
                            <form onSubmit={(e) => { e.preventDefault(); register(); }} >
                                <h1>Preencha os dados do Cliente</h1>
                                <input type="hidden" name="_next" value="http://localhost:3000/" />
                                <input type="text" placeholder="Username" id="name" name="name" onChange={(e) => setUsername(e.target.value)} required />
                                <div className="password-input-container">
                                    <input placeholder="Senha" id="newPass" type={showPasswordRegister ? "text" : "password"} name="newPass" onChange={(e) => setNewpass(e.target.value)} required />
                                    <img className="password-icon" src={showPasswordRegister ? eyeOpen : eyeClosed} onClick={togglePasswordVisibilityRegister} alt="Toggle password visibility" />
                                </div>
                                <div className="password-input-container">
                                    <input type={showPasswordRegister ? "text" : "password"} placeholder="Confirma senha" id="confirmNewPass" name="confirmNewPass" onChange={(e) => setConfirmNewPass(e.target.value)} required />
                                    <img className="password-icon" src={showPasswordRegister ? eyeOpen : eyeClosed} onClick={togglePasswordVisibilityRegister} alt="Toggle password visibility" />
                                </div>
                                <button type="submit">Cadastrar</button>
                            </form>
                        )}
                    </div>
                </div>
                <div className="w-1/2 flex justify-center">
                    <div className="form-container sign-in">
                        <form>
                            <h1>Login</h1>
                            <input type="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                            <div className="password-input-container">
                                <input className="input-password" type={showPassword ? "text" : "password"} placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
                                <img className="password-icon" src={showPassword ? eyeOpen : eyeClosed} onClick={togglePasswordVisibility} alt="Toggle password visibility" />
                            </div>
                            <a href="#">Esqueceu sua senha?</a>
                            <button type="submit" onClick={(e) => { e.preventDefault(); login(); }}>Entrar</button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="toggle-container">
                <div className="toggle">
                    <div className="toggle-panel toggle-left">
                        <h1>Já faz parte?</h1>
                        <p>Entre com sua conta!</p>
                        <button onClick={() => setIsActive(false)} id="login">Entrar</button>
                    </div>
                    <div className="toggle-panel toggle-right">
                        <h1>Bem Vindo!</h1>
                        <p>Crie agora mesmo sua conta!</p>
                        <button onClick={() => setIsActive(true)} id="register">Criar</button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
