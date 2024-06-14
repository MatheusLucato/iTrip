import React, { useEffect, useState } from 'react';
import './styles.css';
import { useNavigate } from "react-router-dom";
import api from '../../api/api'
import eyeClosed from '../../img/Olho Fechado.svg'
import eyeOpen from '../../img/Olho.svg'
import axios from 'axios';

export function Login() {
    localStorage.removeItem('token');
    const navigate = useNavigate();
    const [username, setusername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e: any) => {
        e.preventDefault();
        try {
            const response = await api.post("/api/login", { username, password });
            const { token } = response.data;

            if (token && token.token) {
                localStorage.setItem("token", token.token);
                navigate("/home");
            } else {
                setError("Credenciais inválidas. Verifique seu e-mail e senha.");
            }
        } catch {
            setError("Ocorreu um erro ao fazer login. Por favor, tente novamente mais tarde.");
        }
    };

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const goToRegister = () => {
        navigate("/register")
    };

    return (
        <div className='body bg-gray-100 flex justify-center items-center h-screen'>
            <div className="container bg-white p-8 rounded-3xl shadow-md w-96"> {/* Increased border radius */}
                <form onSubmit={handleLogin}>
                    <h1 className="text-xl font-bold mb-4 text-center">Login</h1>
                    <input type="text" placeholder="Username" className="input border border-gray-300 p-2 w-full mb-4 rounded-lg" value={username} onChange={(e) => setusername(e.target.value)} required />
                    <div className="password-input-container relative mb-4">
                        <input className="input border border-gray-300 p-2 w-full rounded-lg" type={showPassword ? "text" : "password"} placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <img className="password-icon absolute inset-y-0 right-2 top-1/2 transform -translate-y-1/2 cursor-pointer" src={showPassword ? eyeOpen : eyeClosed} onClick={togglePasswordVisibility} alt="Toggle password visibility" />
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
                    <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg w-full mb-4" type="submit">Entrar</button>
                    <button className="text-blue-500 hover:text-blue-700 text-sm w-full text-center" type="button" onClick={goToRegister}>Não tem conta? Cadastre-se</button>
                </form>
            </div>
        </div>
    );
}
