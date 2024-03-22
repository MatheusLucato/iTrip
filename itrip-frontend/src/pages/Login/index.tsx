import React, { useEffect, useState } from 'react';
import './styles.css';
import { useNavigate } from "react-router-dom";
import api from '../../api/api'
import eyeClosed from '../../img/Olho Fechado.svg'
import eyeOpen from '../../img/Olho.svg'

export function Login() {
    localStorage.removeItem('token');
    const [isActive, setIsActive] = useState(false);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [phone, setPhone] = useState("");
    const [isDriver, setIsDriver] = useState(false);
    const [isPassenger, setIsPassenger] = useState(false);

    const handleDriverChange = (e: any) => {
        setIsDriver(e.target.checked);
        setIsPassenger(false);
    };

    const handlePassengerChange = (e: any) => {
        setIsPassenger(e.target.checked);
        setIsDriver(false);
    };

    async function login() {
        try {
            const response = await api.post("/api/login", { email, password });
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

    return (
        <div className='body'>
            <div className={`container ${isActive ? 'active' : ''}`} id="container">
                <div className="flex justify-center items-center h-full">
                    <div className="w-1/2 flex justify-center">
                        <div className="form-container sign-up">
                            <form action="https://formspree.io/f/mnqevjrr" method="POST">
                                <h1>Preencha os dados</h1>
                                <input type="hidden" name="_next" value="http://localhost:3000/" />
                                <input type="text" placeholder="Nome de usuario" id="name" name="name" required />
                                <input type="text" placeholder="Senha" id="newPass" name="newPass" required />
                                <input type="text" placeholder="Confirma senha" id="confirmNewPass" name="confirmNewPass" required />
                                <input type="checkbox" id="motorista" name="motorista" checked={isDriver} onChange={handleDriverChange} />
                                <label htmlFor="motorista">Motorista</label>
                                <input type="checkbox" id="passageiro" name="passageiro" checked={isPassenger} onChange={handlePassengerChange} />
                                <label htmlFor="passageiro">Passageiro</label>
                                <button type="submit">Cadastrar</button>
                            </form>
                        </div>
                    </div>
                    <div className="w-1/2 flex justify-center">
                        <div className="form-container sign-in">
                            <form>
                                <h1>Login</h1>
                                <input type="email" placeholder="Email" value={email} onChange={(e: any) => setEmail(e.target.value)} />
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
                            <h1>Já faz parte do nosso time?</h1>
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
